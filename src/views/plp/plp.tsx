import React, { FC, useState } from "react"
import { Link } from "gatsby";
import styled from 'styled-components';
import { StaticImage } from "gatsby-plugin-image"
//
import Layout from 'components/Layout';
import SEO from 'components/SEO';

interface Props {
    path: any,
    pageContext: any
}

const PLP: FC<Props> = ({ path, pageContext }) => {
    const { countryName, propertyType, plpData, CountryCodes, buyObject } = pageContext;

    const nearbyCities = { "data": [{ "id": 3189937, "wikiDataId": "Q189960", "type": "CITY", "city": "Sydney", "name": "Westminster", "country": "United Kingdom", "countryCode": "GB", "region": "England", "regionCode": "ENG", "latitude": 51.4995, "longitude": -0.1333, "population": 247614, "distance": 0.59 }, { "id": 43022, "wikiDataId": "Q179351", "type": "ADM2", "city": "Westminster", "name": "City of Westminster", "country": "United Kingdom", "countryCode": "GB", "region": "England", "regionCode": "ENG", "latitude": 51.51291, "longitude": -0.15895, "population": 255324, "distance": 1.41 }, { "id": 46852, "wikiDataId": "Q743535", "type": "CITY", "city": "Chelsea", "name": "Chelsea", "country": "United Kingdom", "countryCode": "GB", "region": "England", "regionCode": "ENG", "latitude": 51.4875, "longitude": -0.1684, "population": 60000, "distance": 2.23 }, { "id": 3002532, "wikiDataId": "Q205679", "type": "ADM2", "city": "Hackney", "name": "Hackney", "country": "United Kingdom", "countryCode": "GB", "region": "England", "regionCode": "ENG", "latitude": 51.53333, "longitude": -0.08333, "population": 279665, "distance": 2.62 }, { "id": 3080040, "wikiDataId": "Q125163", "type": "CITY", "city": "Islington", "name": "Islington", "country": "United Kingdom", "countryCode": "GB", "region": "England", "regionCode": "ENG", "latitude": 51.544, "longitude": -0.1027, "population": 206125, "distance": 2.76 }, { "id": 3100107, "wikiDataId": "Q202088", "type": "ADM2", "city": "Camden", "name": "London Borough of Camden", "country": "United Kingdom", "countryCode": "GB", "region": "England", "regionCode": "ENG", "latitude": 51.54281, "longitude": -0.15942, "population": 262226, "distance": 2.82 }, { "id": 3185891, "wikiDataId": "Q188801", "type": "ADM2", "city": "Kensington", "name": "Royal Borough of Kensington and Chelsea", "country": "United Kingdom", "countryCode": "GB", "region": "England", "regionCode": "ENG", "latitude": 51.50299, "longitude": -0.19314, "population": 156197, "distance": 2.84 }, { "id": 3420637, "wikiDataId": "Q205817", "type": "ADM2", "city": "Islington", "name": "London Borough of Islington", "country": "United Kingdom", "countryCode": "GB", "region": "England", "regionCode": "ENG", "latitude": 51.54702, "longitude": -0.10944, "population": 239142, "distance": 2.86 }, { "id": 3055584, "wikiDataId": "Q146690", "type": "CITY", "city": "Brixton", "name": "Brixton", "country": "United Kingdom", "countryCode": "GB", "region": "England", "regionCode": "ENG", "latitude": 51.463, "longitude": -0.106, "population": 66300, "distance": 3.19 }, { "id": 2980150, "wikiDataId": "Q208152", "type": "ADM2", "city": "Hamlet", "name": "London Borough of Tower Hamlets", "country": "United Kingdom", "countryCode": "GB", "region": "England", "regionCode": "ENG", "latitude": 51.51667, "longitude": -0.05, "population": 317705, "distance": 3.4 }], "metadata": { "currentOffset": 0, "totalCount": 263 } };

    const url = path.split('/');

    let temp: string;

    return (
        <Layout>
            <SEO title="CBRE Properties" />
            <Header1>{plpData && plpData.length} {url[url.length - 1].replace('-', ' ')}</Header1>
            <Container>
                <div id="plpContainer">
                    <PropertyCardContainer>
                        {plpData && plpData[0] && plpData.map((listing: any, index: any) => {
                            const list = listing.listing;
                            const actualAddress = listing.address;
                            const postalAddresses = 'Common.PostalAddresses';
                            let local;
                            let postalAddress: any = {}
                            if (actualAddress[postalAddresses] && actualAddress[postalAddresses][0]) {
                                postalAddress = actualAddress[postalAddresses][0]
                                local = postalAddress['Common.Locallity'] || actualAddress['Common.Locallity'] || null;
                            }

                            let thePath = path;
                            if (local) {
                                local = local.replace(/\s+/g, '-').toLowerCase();
                                if (url.length < 6) {
                                    url.splice(url.length - 1, 0, local)
                                }
                                thePath = url.join('/')
                            }

                            const description = list['Common.LongDescription'] && list['Common.LongDescription'][0] && list['Common.LongDescription'][0]['Common.Text'];

                            const size = list['Common.TotalSize'][0];

                            const charges = list['Common.Charges'][0];

                            const pType = list['Common.UsageType'];

                            temp = pType;



                            // console.log(list, charges)

                            return (
                                <Link key={index + listing.key} to={thePath + '/' + listing.key}>
                                    <PropertyCard className="propertyCard" key={index + listing.key + ' propertyCard'}>
                                        <img className="favorite-icon" src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/icon-star-line.png" alt="favorite icon" />
                                        {listing.image &&
                                            <img src={'https://www.cbre.us' + listing.image} loading="lazy" />
                                        }
                                        <PropertyDetails>
                                            <div className="address" style={{float: 'left', width: '60%', display: 'block'}}>
                                                <h3>{postalAddress['Common.Line1']} {postalAddress['Common.Line3'] && postalAddress['Common.Line3']}</h3>
                                                <h5>
                                                    {postalAddress['Common.Locallity'] && <span>{postalAddress['Common.Locallity']},</span>}
                                                    {postalAddress['Common.Region'] && <span>{postalAddress['Common.Region']}</span>}
                                                </h5>
                                                <p>{description && description.substring(0, 250)}</p>
                                            </div>
                                            <div className="propertyInfo">
                                                <p><Label>Space Available</Label> <Info>{size['Common.Size']} {size['Common.Units']}</Info></p>
                                                <p><Label>Spaces</Label><Info>{Math.floor(Math.random() * 5)} Spaces</Info></p>
                                                <p><Label>Price</Label> <Info>{charges && charges['Common.ChargeKind']}</Info></p>
                                                <p><Label>Status</Label> <Info>Available Now</Info></p>
                                                <p><Label>Type</Label> <Info>{pType}</Info></p>
                                            </div>
                                        </PropertyDetails>
                                    </PropertyCard>
                                </Link>
                            )
                        })}
                    </PropertyCardContainer>
                    <Sidebar>
                        <ul style={{ listStyle: 'none', paddingRight: '20px' }}>
                            <h3>{url[url.length - 1].replace('-', ' ')} around {url[url.length - 2].replace('-', ' ')}</h3>
                            {nearbyCities.data.map((city: any, i: number) => (
                                <li style={{marginBottom: '8px'}}>
                                    <Link to="/" style={{color: '#006A4D', textTransform: 'capitalize'}}>
                                        {url[url.length - 1].replace('-', ' ')} in {city.city}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Sidebar>
                </div>
                {/* <div id="map">
                <Map
                    coordinateArray={coordinateArray}
                />
            </div> */}
            </Container>
        </Layout>
    )
};

export default PLP;

const Label = styled.span`
    font-size: 12px;
    text-transform: uppercase;
    color: #666666;
`;

const Info = styled.span`
    font-size:14px;
    color:#333;
    float:right;
    margin-left:50px;
`

const Sidebar = styled.div`
    width:27%;
    ul { 
        border: 1px solid #CAD1D3;
        padding-top:20px;
        padding-bottom:20px;
        margin-top:0;
        a {
            text-decoration: none;
            font-size:16px;
        }
    }
    margin-left:0;
    position:relative;
    left:1%;
    margin-top:25px;a
    li {
        color: #006A4D !important;
    }
    h3 {
        text-transform: capitalize;
        color: #333;
        font-size:21px;
        margin-top:0;
    }
`

const PropertyCard = styled.div`
    margin: 30px 0;
    width:936px;
    height:250px;
    border: 1px solid #CAD1D3;
    display:flex;
    img {
        max-width:208px;
        height:100%;
        float:left;
    }
    position:relative;
    .favorite-icon {
        position:absolute;
        height:18px;
        right:5px;
        top:5px;
    }
`;

const PropertyDetails = styled.div`
    display:block;
    float:left;
    padding: 10px 15px;
    h3, p {
        color: #333;
        text-decoration:none;
    }
    h3 {
        text-transform: capitalize;
    }
    > div > h3 {
        font-size:21px;
        margin-top:16px;
        margin-bottom:8px;
    }
    .propertyInfo {
        display:block;
        float:right;
        padding-right:25px;
        padding-top:12px;
    }
    .address {
        p {
            font-size:16px;
        }
    }
    h5 {
        color: #666666;
        font-size:16px;
        margin-top:0px;
    }
`;

const Container = styled.div`
    font-familty: sans-serif;
    display: flex;
    justify-content: space-between;
    width:90%;
    margin: 0 auto;
    #plpContainer {
        width:100%;
        display:flex;
    }
    #map  {
        width:50%;
        position:sticky;
        top:121px;
        max-height:calc(100vh - 120px)
    }
`;

const PropertyCardContainer = styled.div`
    width:75%;
    > a {
        width:100%;
        float:left;
        height:250px;
        margin-bottom:45px;
    }
`;

const Header1 = styled.h1`
    font-size: 24px;
    color: #333;
    width:90%;
    display:block;
    margin: 0 auto;
    margin-top:30px;
    text-transform: capitalize;
`;



    // const Codes = CountryCodes.buckets.map(country => {
    //     return country.key.substring(0, 2);
    // })

    // filter down coords that aren't within country
    // const listings = plpData.filter(listing => {
    //     const countryCode = listing.address['Common.Country'].toLowerCase();
    //     console.log(countryCode)
    //     if (Codes.includes(countryCode) || countryName.toLowerCase() === countryCode){
    //         return false;
    //     }

    //     return true;
    // }).map(function(listing) { return listing });

    // This was used to convert the coordinates into a data model compatible with google maps
    // const coordinateArray = plpData.map((listing: any, index: any) => {
    //     let coord = listing.coords;
    //     coord.lng = coord.lon;
    //     delete coord.lon;
    //     return coord;
    // });


    // reduce coordinateArray to only include coords which are within the country