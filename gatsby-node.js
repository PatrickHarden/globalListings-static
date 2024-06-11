const path = require('path');

const axios = require('axios');
const CountryCodes = require('./country-codes.json');

// results is an object array used for congregating all of the country specific data from the configs & api
let results = [];

// global variables which are constructed from the local config
let countryCodes = [];
let countries = [];
let apis = [];

// amount of properties to pull from the api
const pageSize = 600;
const fallbackApi = 'https://www.cbre.com.au/property-api/propertylistings/query?Site=';
const loopAmount = 20;
let timeOut = 1; // default delay between api pulls
let page = 1;

//Instead of writing import Header from '../../components/header' you can write import Header from 'components/header' with absolute imports:
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules']
    }
  });
};


// Contruct the results object array from api/config data
const constructAllData = () => {
  return new Promise(function (res, rej) {

    const pullData = countryCodes.map(async (siteId, index) => {

      // conditionally add a delay between api pulls to ensure the api doesn't respond with 429 - Too many requests error
      await sleep(timeOut).then(async () => {
        // default listings value
        let listingsData = [];
        let documentCount = null;

        // construct an api for each country siteId and api
        const listingsApi = apis[index] + siteId + '&PageSize=' + pageSize + '&Page=' + page;
        const fallback = fallbackApi + siteId + '&PageSize=' + pageSize + '&Page=' + page;

        // pull data from elastic
        const [listings] = await Promise.all([
          axios.get(listingsApi).catch(error => { logApiErrors(error, listingsApi) })
        ]);


        // narrow api response, revert to fallback api if initial pull was unfruitful
        if (listings && listings.data && listings.data.Documents[0]) {
          documentCount = listings.data.DocumentCount;

          // if propertyCount is higher than the page size, pull the rest of the properties
          listingsData = listings.data.Documents[0];

          timeOut = 1;

        } else {
          // fallback api call in case the initial fails - you can pull any countries properties from any prod api endpoint
          await Promise.all([
            axios.get(fallback).then(response => {
              if (response && response.data && response.data.Documents[0]) {
                listingsData = response.data.Documents[0];
                documentCount = listings.data.DocumentCount;
                console.log('fallback api successful for:', siteId);
                timeOut = 400;       // add a delay to prevent 429 error - searchApi really hates getting hit often
              }
            }).catch(er => {
              logApiErrors(er, listingsApi)
            })
          ])
        }


        // for each unique property type found in the received country's listings, push it to the propertyTypes array
        const propertyTypes = [];
        listingsData.map(listing => {
          if (propertyTypes.indexOf(listing['Common.UsageType']) === -1) {
            propertyTypes.push(listing['Common.UsageType']);
          }
        });


        // sort the listings so that listings which contain the same property type reside in the same index of the array
        const sortedListings = [];
        propertyTypes.map((propertyType, index) => {
          listingsData.map(listing => {
            if (listing['Common.UsageType'] == propertyType) {
              if (Array.isArray(sortedListings[index])) {
                sortedListings[index].push(listing);
              } else {
                sortedListings[index] = new Array(listing);
              }
            }
          })
        });


        if (sortedListings.length !== 0) {
          let resultExists = false;
          results.forEach((result, i) => {
            if (result.countryName === countries[index]) {
              //
              countryListings = results[i].listings;
              countryListings.forEach((listingsArray, x) => {
                const pType = listingsArray[0]['Common.UsageType'];
                sortedListings.forEach((lArray, y) => {
                  lArray.forEach((list, z) => {
                    if (list['Common.UsageType'] == pType) {
                      countryListings[x].push(list);
                    }
                  })
                })
              })


              results[i].listings = countryListings;
              resultExists = true;
            }
          });
          if (!resultExists) {
            results.push(
              {
                countryName: countries[index],
                listings: sortedListings,
                siteId: siteId,
                propertyTypes: propertyTypes,
                pdpConfigs: ''
              }
            )
          }
        }
      })
    })

    // resolve the promise after all of countries have been looped through
    res(Promise.all(pullData));
  })
};



// this function is executed first in the gatsby lifecycle
exports.createPages = async ({ actions: { createPage } }) => {

  // push local config information into global variables
  CountryCodes.buckets.map(countryCode => {
    countryCodes.push(countryCode['key']);
    countries.push(countryCode['country']);
    apis.push(countryCode['api']);
  })

  // Wait until the api data arrives before proceeding - gatsby requires the createPage function to be syncronous, so I set it up like this at the time
  for (var x = 2; x < (loopAmount + 2); x++) {
    await constructAllData().then((response) => {
      page = x;
    });
  }

  // an array of objects with minimal country information - used to create routing for plp global page
  let countryInfo = [];
  // setup layout variable use to determine layout wrapper
  let layout = '';

  // for each index in the allData array (or for each country)
  results.forEach((country, z) => {

    // destructure country object into variables
    const { listings, propertyTypes, countryName, siteId, pdpConfig } = country;

    // push the propertyTypes and the country name into it's a multicountry array - we'll use this later for generating links between pages

    const allData = [];
    listings.forEach(listing => {
      for (var x = 0; x < listing.length; x++) {
        allData.push(listing[x])
      }
    })

    const countrySaleRegionData = [];
    const countryLeaseRegionData = [];
    const regions = [];

    countryInfo.push({
      countryName: countryName,
      propertyTypes: propertyTypes,
      countrySaleRegionData: countrySaleRegionData,
      countryLeaseRegionData: countryLeaseRegionData,
      regions: regions
    });

    // propertyTypes array and listings array should share similar property types per index
    propertyTypes.map((propertyType, index) => {
      const data = listings[index];
      layout = 'property listings page';

      const buyListings = [];
      const leaseListings = data.map((listing, i) => {
        const aspects = listing['Common.Aspects'];
        if (aspects && aspects.includes('isLetting')) {
          return listing;
        } else if (aspects) {
          buyListings.push(listing)
        }
      });

      const buyObject = {
        allListings: '',
        regions: [],
        propertyType: propertyType,
        countryName: countryName
      }
      const buyRegions = [];
      const leaseObject = {
        allListings: '',
        regions: [],
        propertyType: propertyType,
        countryName: countryName
      }
      const leaseRegions = [];

      const postalAddresses = 'Common.PostalAddresses'

      buyListings.map(list => {
        const actualAddress = list['Common.ActualAddress'];
        if (actualAddress[postalAddresses] && actualAddress[postalAddresses][0]) {
          const postalAddress = actualAddress[postalAddresses][0]
          if (postalAddress['Common.Region'] && buyRegions.indexOf(postalAddress['Common.Region']) === -1) {
            const region = postalAddress['Common.Region']
            buyRegions.push(region);
            if (regions.indexOf(region) === -1) {
              regions.push(region)
            }
          }
        }
      })

      buyRegions.map(region => {
        const result = {
          region: region,
          listings: [],
          localities: []
        }
        buyListings.map(list => {
          const actualAddress = list['Common.ActualAddress'];
          if (actualAddress[postalAddresses] && actualAddress[postalAddresses][0]) {
            const postalAddress = actualAddress[postalAddresses][0]
            if (postalAddress['Common.Region'] === region) {
              result.listings.push(list);
              if (postalAddress['Common.Locallity']){
                result.localities.push(postalAddress['Common.Locallity']);
              }
            }

          }
        })
        buyObject.regions.push(result)
      })

      if (leaseListings.length > 0) {
        leaseListings.map(list => {
          if (list) {
            const actualAddress = list['Common.ActualAddress'];
            if (actualAddress[postalAddresses] && actualAddress[postalAddresses][0]) {
              const postalAddress = actualAddress[postalAddresses][0]
              if (postalAddress['Common.Region'] && leaseRegions.indexOf(postalAddress['Common.Region']) === -1) {
                const region = postalAddress['Common.Region']
                leaseRegions.push(region);
                if (regions.indexOf(region) === -1) {
                  regions.push(region)
                }
              }
            }
          }
        })

        leaseRegions.map(region => {
          const result = {
            region: region,
            listings: [],
            localities: []
          }
          leaseListings.map(list => {
            if (list) {
              const actualAddress = list['Common.ActualAddress'];
              if (actualAddress[postalAddresses] && actualAddress[postalAddresses][0]) {
                const postalAddress = actualAddress[postalAddresses][0]
                if (postalAddress['Common.Region'] === region) {
                  result.listings.push(list);
                  if (postalAddress['Common.Locallity']){
                    result.localities.push(postalAddress['Common.Locallity']);
                  }
                }
              }
            }
          })
          leaseObject.regions.push(result)
        })
      }

      countrySaleRegionData.push(buyObject);
      countryLeaseRegionData.push(leaseObject);
    });

    countrySaleRegionData.forEach(saleRegions => {
      const pType = saleRegions.propertyType;
      const postalAddresses = 'Common.PostalAddresses';

      saleRegions.regions.forEach((region, x) => {
        const localityListings = [];
        let plpData = region.listings.map((listing, i) => {
          const key = listing['Common.PrimaryKey'];
          let locality = null;
          const actualAddress = listing['Common.ActualAddress'];
          if (actualAddress[postalAddresses] && actualAddress[postalAddresses][0]) {
            const postalAddress = actualAddress[postalAddresses][0]
            if (postalAddress['Common.Region'] === region) {
              result.listings.push(list);
              if (postalAddress['Common.Locallity']){
                result.localities.push(postalAddress['Common.Locallity']);
              }
            }
            locality = postalAddress['Common.Locallity'] || actualAddress['Common.Locallity'] || null;
          }

          const localities = []
          if (locality && (locality !== region.region)) {
            region.listings.forEach(list => {
              const actualAddress = list['Common.ActualAddress'];
              if (actualAddress[postalAddresses] && actualAddress[postalAddresses][0]) {
                const postalAddress = actualAddress[postalAddresses][0]
                const local = postalAddress['Common.Locallity'] || actualAddress['Common.Locallity'] || null;
                if (local === locality) {
                  localities.push(list)
                }
              }
            })
            localityListings.push(localities)
          }

          if (locality && (locality !== region.region)) {
            createPage({
              path: `/properties/${countryName}/${region.region.replace(/\s+/g, '-').toLowerCase()}/${locality.replace(/\s+/g, '-').toLowerCase()}/${pType.replace(/\s+/g, '-').toLowerCase()}-properties-for-sale/${key}`,
              component: require.resolve("./src/views/pdp/pdp.tsx"),
              context: { listing },
            });
          } else {
            createPage({
              path: `/properties/${countryName}/${region.region.replace(/\s+/g, '-').toLowerCase()}/${pType.replace(/\s+/g, '-').toLowerCase()}-properties-for-sale/${key}`,
              component: require.resolve("./src/views/pdp/pdp.tsx"),
              context: { listing },
            });
          }

          return {
            key: listing['Common.PrimaryKey'],
            image: listing['Common.Photos'] && listing['Common.Photos'][0] && listing['Common.Photos'][0]['Common.ImageResources'][0]['Common.Resource.Uri'],
            coords: listing['Common.Coordinate'],
            address: listing['Common.ActualAddress'],
            listing: listing
          }
        })

        if (localityListings.length > 0) {
          localityListings.forEach(localityArray => {
            let locality = null;
            const listing = localityArray[0];
            const actualAddress = listing['Common.ActualAddress'];
            if (actualAddress[postalAddresses] && actualAddress[postalAddresses][0]) {
              const postalAddress = actualAddress[postalAddresses][0]
              if (postalAddress['Common.Region'] === region) {
                result.listings.push(list);
                if (postalAddress['Common.Locallity']){
                  result.localities.push(postalAddress['Common.Locallity']);
                }
              }
              locality = postalAddress['Common.Locallity'] || actualAddress['Common.Locallity'] || null;
            }
            if (locality) {
              const plpData = localityArray.map(l => {
                return {
                  key: l['Common.PrimaryKey'],
                  image: l['Common.Photos'] && l['Common.Photos'][0] && l['Common.Photos'][0]['Common.ImageResources'][0]['Common.Resource.Uri'],
                  coords: l['Common.Coordinate'],
                  address: l['Common.ActualAddress'],
                  listing: l
                }
              })

              // plp page
              createPage({
                path: `/properties/${countryName}/${region.region.replace(/\s+/g, '-').toLowerCase()}/${locality.replace(/\s+/g, '-').toLowerCase()}/${pType.toLowerCase()}-properties-for-sale`,
                component: require.resolve("./src/views/plp/plp.tsx"),
                context: { plpData },
              })
            }
          })
        }

        // plp page
        createPage({
          path: `/properties/${countryName}/${region.region.replace(/\s+/g, '-').toLowerCase()}/${pType.toLowerCase()}-properties-for-sale`,
          component: require.resolve("./src/views/plp/plp.tsx"),
          context: { plpData },
        })
      })
    })

    countryLeaseRegionData.forEach(saleRegions => {
      const pType = saleRegions.propertyType;
      const postalAddresses = 'Common.PostalAddresses';
      saleRegions.regions.forEach(region => {
        const localityListings = [];
        const plpData = region.listings.map((listing, i) => {
          const key = listing['Common.PrimaryKey'];
          let locality = null;
          const actualAddress = listing['Common.ActualAddress'];
          if (actualAddress[postalAddresses] && actualAddress[postalAddresses][0]) {
            const postalAddress = actualAddress[postalAddresses][0]
            if (postalAddress['Common.Region'] === region) {
              result.listings.push(list);
              if (postalAddress['Common.Locallity']){
                result.localities.push(postalAddress['Common.Locallity']);
              }
            }
            locality = postalAddress['Common.Locallity'] || actualAddress['Common.Locallity'] || null;
          }

          const localities = []
          if (locality && (locality !== region.region)) {
            region.listings.forEach(list => {
              const actualAddress = list['Common.ActualAddress'];
              if (actualAddress[postalAddresses] && actualAddress[postalAddresses][0]) {
                const postalAddress = actualAddress[postalAddresses][0]
                const local = postalAddress['Common.Locallity'] || actualAddress['Common.Locallity'] || null;
                if (local === locality) {
                  localities.push(list)
                }
              }
            })
            localityListings.push(localities)
          }

          if (locality && (locality !== region.region)) {
            createPage({
              path: `/properties/${countryName}/${region.region.replace(/\s+/g, '-').toLowerCase()}/${locality.replace(/\s+/g, '-').toLowerCase()}/${pType.replace(/\s+/g, '-').toLowerCase()}-properties-for-lease/${key}`,
              component: require.resolve("./src/views/pdp/pdp.tsx"),
              context: { listing },
            });
          } else {
            createPage({
              path: `/properties/${countryName}/${region.region.replace(/\s+/g, '-').toLowerCase()}/${pType.replace(/\s+/g, '-').toLowerCase()}-properties-for-lease/${key}`,
              component: require.resolve("./src/views/pdp/pdp.tsx"),
              context: { listing },
            });
          }

          return {
            key: listing['Common.PrimaryKey'],
            image: listing['Common.Photos'] && listing['Common.Photos'][0] && listing['Common.Photos'][0]['Common.ImageResources'][0]['Common.Resource.Uri'],
            coords: listing['Common.Coordinate'],
            address: listing['Common.ActualAddress'],
            listing: listing
          }
        })

        if (localityListings.length > 0) {
          localityListings.forEach(localityArray => {
            let locality = null;
            const listing = localityArray[0];
            const actualAddress = listing['Common.ActualAddress'];
            if (actualAddress[postalAddresses] && actualAddress[postalAddresses][0]) {
              const postalAddress = actualAddress[postalAddresses][0]
              if (postalAddress['Common.Region'] === region) {
                result.listings.push(list);
                if (postalAddress['Common.Locallity']){
                  result.localities.push(postalAddress['Common.Locallity']);
                }
              }
              locality = postalAddress['Common.Locallity'] || actualAddress['Common.Locallity'] || null;
            }
            if (locality) {
              const plpData = localityArray.map(l => {
                return {
                  key: l['Common.PrimaryKey'],
                  image: l['Common.Photos'] && l['Common.Photos'][0] && l['Common.Photos'][0]['Common.ImageResources'][0]['Common.Resource.Uri'],
                  coords: l['Common.Coordinate'],
                  address: l['Common.ActualAddress'],
                  listing: l
                }
              })

              // plp page
              createPage({
                path: `/properties/${countryName}/${region.region.replace(/\s+/g, '-').toLowerCase()}/${locality.replace(/\s+/g, '-').toLowerCase()}/${pType.toLowerCase()}-properties-for-lease`,
                component: require.resolve("./src/views/plp/plp.tsx"),
                context: { plpData },
              })
            }
          })
        }

        // plp page
        createPage({
          path: `/properties/${countryName}/${region.region.toLowerCase()}/${pType.toLowerCase()}-properties-for-lease`,
          component: require.resolve("./src/views/plp/plp.tsx"),
          context: { plpData },
        })
      })
    })

    createPage({
      path: `/properties/${countryName}`,
      component: require.resolve("./src/views/country/index.tsx"),
      context: { countryName },
    })

    regions.forEach(region => {
      createPage({
        path: `/properties/${countryName}/${region.replace(/\s+/g, '-').toLowerCase()}`,
        component: require.resolve("./src/views/region/index.tsx"),
        context: { region },
      })
    })
  })


  const test = countryInfo;
  test.forEach((country, index) => {
    country.countrySaleRegionData.forEach((ptype, i) => {
      ptype.regions.map((reg, z) => {
        const tempp = reg;
        delete tempp.listings;
        return tempp;
      })
    })
    country.countryLeaseRegionData.forEach((ptype, i) => {
      ptype.regions.map((reg, z) => {
        const tempp = reg;
        delete tempp.listings;
        return tempp;
      })
    })
  })

  countryInfo = test;
  

  createPage({
    path: `/`,
    component: require.resolve("./src/views/home/index.tsx"),
    context: { countryInfo },
  })

  createPage({
    path: `/about`,
    component: require.resolve("./src/views/about/about.tsx")
  })
}



// helper to determine why an api call failed
const logApiErrors = (error, listingsApi) => {
  if (error.response) {
    console.log(listingsApi, error.response.status);
  } else if (error.request) {
    console.log(listingsApi, 'no response');
  } else {
    console.log('Error', listingsApi, 'bad request');
  }
}

// used to delay the repulling of same api
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
