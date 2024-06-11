import React, { FC, useState } from "react"
import { Link } from "gatsby";
import styled from "styled-components";
import Select from 'react-select';
import makeAnimated from 'react-select/animated'
//
import Layout from 'components/Layout';
import SEO from 'components/SEO';

interface Props {
    pageContext: any,
    buyObject?: any,
    test?: any
}

const Home: FC<Props> = ({ pageContext: { countryInfo } }) => {

    const [index, setIndex] = useState(-1);
    const [countrySelected, setCountrySelected] = useState('');
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);
    const [currentRegion, setCurrentRegion] = useState('');
    const [currentCity, setCurrentCity] = useState('')
    const [currentPropertyType, setCurrentPropertyType] = useState('')
    const [leaseButton, setLeaseButton] = useState('');
    const [sellButton, setSellButton] = useState('');


    // sort countries alphabetically
    const countries = countryInfo.sort((a: any, b: any) => {
        var textA = a.countryName.toUpperCase();
        var textB = b.countryName.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    const temp: any = [];
    countries.forEach((country: any) => {
        temp.push({
            value: country.countryName,
            label: country.countryName
        })
    });


    const animatedComponents = makeAnimated();

    const onCountrySelection = (option: any) => {
        countryInfo.map((country: any, index: any) => {

            if (country.countryName.toLowerCase() === option.value) {
                const pTypeArray: any = [];
                country.propertyTypes.forEach((pType: any) => {
                    pTypeArray.push({
                        value: pType,
                        label: pType
                    })
                })
                setIndex(index)
                setPropertyTypes([]);
                setPropertyTypes(pTypeArray);
                setCountrySelected(option.value);
            }
        })
    }

    const onPropertyTypeSelect = (option: any) => {
        const propertyType = option.value;
        const temp: any = [];
        const leaseData = countryInfo[index].countryLeaseRegionData;
        const saleData = countryInfo[index].countrySaleRegionData;
        leaseData.forEach((data: any) => {
            if (data.propertyType === propertyType) {
                data.regions.forEach((region: any) => {
                    const obj = {
                        value: region.region,
                        label: region.region
                    }
                    temp.push(obj)
                })
            }
        })
        saleData.forEach((data: any) => {
            if (data.propertyType === propertyType) {
                data.regions.forEach((region: any) => {
                    const obj = {
                        value: region.region,
                        label: region.region
                    }
                    temp.push(obj)
                })
            }
        })
        var result = temp.reduce((unique: any, o: any) => {
            if (!unique.some((obj: any) => obj.label === o.label && obj.value === o.value)) {
                unique.push(o);
            }
            return unique;
        }, []);
        setRegions(result);
        setCurrentPropertyType(option.value);
    }

    const onRegionSelect = (option: any) => {
        const leaseInfo: any = countryInfo[index].countryLeaseRegionData.filter((info: any) => info.propertyType === currentPropertyType)[0];
        const saleInfo: any = countryInfo[index].countrySaleRegionData.filter((info: any) => info.propertyType === currentPropertyType)[0];

        // .split(" ").join("-")
        let tempCities: any = [];
        let saleCityExists = false;
        let leaseCityExists = false;
        saleInfo.regions.forEach((info: any) => {
            if (info.region === option.value) {
                saleCityExists = true;
                info.localities.forEach((local: string) => {
                    tempCities.push(local);
                })
            }
        })

        leaseInfo.regions.forEach((info: any) => {
            if (info.region === option.value) {
                leaseCityExists = true;
                info.localities.forEach((local: string) => {
                    tempCities.push(local);
                })
            }
        })
        // remove duplicate cities
        tempCities = tempCities.filter((c: any, index: any) => {
            return tempCities.indexOf(c) == index;
        });;

        tempCities = tempCities.map((city: any) => ({
            value: city,
            label: city
        }))


        setCities(tempCities)
        setCurrentRegion(option.value);
        if (saleCityExists) {
            setSellButton(`/properties/${countrySelected.toLowerCase()}/${option.value.replace(/\s+/g, '-').toLowerCase()}/${currentPropertyType.toLowerCase()}-properties-for-sale`)
        } else {
            setSellButton('')
        }
        if (leaseCityExists) {
            setLeaseButton(`/properties/${countrySelected.toLowerCase()}/${option.value.replace(/\s+/g, '-').toLowerCase()}/${currentPropertyType.toLowerCase()}-properties-for-lease`)
        } else {
            setLeaseButton('')
        }
    }

    const onCitySelect = (option: any) => {
        const leaseInfo: any = countryInfo[index].countryLeaseRegionData.filter((info: any) => info.propertyType === currentPropertyType)[0];
        const saleInfo: any = countryInfo[index].countrySaleRegionData.filter((info: any) => info.propertyType === currentPropertyType)[0];
        let saleCityExists = false;
        let leaseCityExists = false;
        saleInfo.regions.forEach((info: any) => {
            if (info.region === currentRegion) {
                info.localities.forEach((local: string) => {
                    if (local == option.value){
                        saleCityExists = true;
                    }
                })
            }
        })
        leaseInfo.regions.forEach((info: any) => {
            if (info.region === currentRegion) {
                info.localities.forEach((local: string) => {
                    if (local == option.value){
                        leaseCityExists = true;
                    }
                })
            }
        })


        setCurrentCity(option.value);
        if (leaseCityExists){
            setLeaseButton(`/properties/${countrySelected.toLowerCase()}/${currentRegion.replace(/\s+/g, '-').toLowerCase()}/${option.value.replace(/\s+/g, '-').toLowerCase()}/${currentPropertyType.toLowerCase()}-properties-for-lease`)
        } else {
            setLeaseButton('')
        }
        if (saleCityExists){
            setSellButton(`/properties/${countrySelected.toLowerCase()}/${currentRegion.replace(/\s+/g, '-').toLowerCase()}/${option.value.replace(/\s+/g, '-').toLowerCase()}/${currentPropertyType.toLowerCase()}-properties-for-sale`)
        } else {
            setSellButton('')
        }
    }


    return (
        <Layout>
            <SEO title="CBRE Properties" />
            <Container>
                <SearchBoxContainer>
                    <SearchContainer>
                        <div id="searchHeader">Search properties</div>
                        <DropdownContainer>
                            <Select
                                options={temp}
                                components={animatedComponents}
                                placeholder="Select country"
                                onChange={onCountrySelection}
                            />
                            <Select
                                options={propertyTypes}
                                components={animatedComponents}
                                placeholder="Select property type"
                                onChange={onPropertyTypeSelect}
                                isDisabled={propertyTypes.length > 0 ? false : true}
                            />
                            <Select
                                options={regions}
                                components={animatedComponents}
                                placeholder="Select region"
                                onChange={onRegionSelect}
                                isDisabled={regions.length > 0 ? false : true}
                            />
                            <Select
                                options={cities}
                                components={animatedComponents}
                                placeholder="Select city"
                                onChange={onCitySelect}
                                isDisabled={cities.length > 0 ? false : true}
                            />
                        </DropdownContainer>
                        <ButtonContainer>
                            {(sellButton !== '') ?
                                <Button><Link to={sellButton}>For Sale</Link></Button>
                                :
                                <Button style={{ backgroundColor: '#999' }}><a>For Sale</a></Button>
                            }
                            {(leaseButton !== '') ?
                                <Button><Link to={leaseButton}>For Lease</Link></Button>
                                :
                                <Button style={{ backgroundColor: '#999' }}><a>For Lease</a></Button>
                            }
                        </ButtonContainer>
                    </SearchContainer>
                </SearchBoxContainer>
                {/* <div style={{ maxWidth: '90%', margin: '0 auto' }}>
                    <h2 style={{ color: '#666', marginBottom: '25px' }}>
                        PLP Global
                    </h2>
                    {countries.map((country: any, index: any) => (
                        <div key={country + index + ''}>
                            <h3 style={{ textTransform: 'capitalize', color: '#666' }}>
                                <Link to={'/properties/' + country.countryName}>{country.countryName}</Link>
                            </h3>
                            {country.propertyTypes.map((propertyType: any, i: any) => (
                            <div key={country + propertyType + '' + i} style={{ marginTop: '15px' }}>
                                <Link to={'/properties/' + propertyType + '/' + country.countryName + '/'} style={{ padding: '10px' }}>
                                    {propertyType}
                                </Link>
                            </div>
                        ))}
                        </div>
                    ))}
                </div> */}
            </Container>
        </Layout>
    )
}

export default Home;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-left: auto;
    margin-top: 30px;
    margin-right: 14px;
    margin-right: 25px;
    justify-content: flex-end;
    > button:first-of-type{
        margin-right:65px;
    }
`

const Button = styled.button`
    text-align: center;
    padding: 0.8rem 2rem;
    color: rgb(255, 255, 255);
    background-color: rgb(0, 106, 77);
    text-decoration: none;
    outline: 0px;
    border: 0px;
    text-transform: uppercase;
    display: block;
    font-size:14px;
    > a {
        color: #fff;
        text-decoration: none;
    }
`;

const DropdownContainer = styled.div`
    display:flex;
    justify-content:space-between;
    padding: 0 15px;
    @media screen and (max-width:520px){
        flex-direction:column;
    }
    > div {
        min-width: 200px;
        padding: 0 10px;
        font-size:14px;
        text-transform: capitalize;
    }
`

const SearchBoxContainer = styled.div`
    width:100%;
    min-height: calc(100vh - 120px);
    position:relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='0' x2='0' y1='0' y2='100%25' gradientTransform='rotate(186,960,489)'%3E%3Cstop offset='0' stop-color='%23ffffff'/%3E%3Cstop offset='1' stop-color='%23006a4d'/%3E%3C/linearGradient%3E%3Cpattern patternUnits='userSpaceOnUse' id='b' width='300' height='250' x='0' y='0' viewBox='0 0 1080 900'%3E%3Cg fill-opacity='0.07'%3E%3Cpolygon fill='%23444' points='90 150 0 300 180 300'/%3E%3Cpolygon points='90 150 180 0 0 0'/%3E%3Cpolygon fill='%23AAA' points='270 150 360 0 180 0'/%3E%3Cpolygon fill='%23DDD' points='450 150 360 300 540 300'/%3E%3Cpolygon fill='%23999' points='450 150 540 0 360 0'/%3E%3Cpolygon points='630 150 540 300 720 300'/%3E%3Cpolygon fill='%23DDD' points='630 150 720 0 540 0'/%3E%3Cpolygon fill='%23444' points='810 150 720 300 900 300'/%3E%3Cpolygon fill='%23FFF' points='810 150 900 0 720 0'/%3E%3Cpolygon fill='%23DDD' points='990 150 900 300 1080 300'/%3E%3Cpolygon fill='%23444' points='990 150 1080 0 900 0'/%3E%3Cpolygon fill='%23DDD' points='90 450 0 600 180 600'/%3E%3Cpolygon points='90 450 180 300 0 300'/%3E%3Cpolygon fill='%23666' points='270 450 180 600 360 600'/%3E%3Cpolygon fill='%23AAA' points='270 450 360 300 180 300'/%3E%3Cpolygon fill='%23DDD' points='450 450 360 600 540 600'/%3E%3Cpolygon fill='%23999' points='450 450 540 300 360 300'/%3E%3Cpolygon fill='%23999' points='630 450 540 600 720 600'/%3E%3Cpolygon fill='%23FFF' points='630 450 720 300 540 300'/%3E%3Cpolygon points='810 450 720 600 900 600'/%3E%3Cpolygon fill='%23DDD' points='810 450 900 300 720 300'/%3E%3Cpolygon fill='%23AAA' points='990 450 900 600 1080 600'/%3E%3Cpolygon fill='%23444' points='990 450 1080 300 900 300'/%3E%3Cpolygon fill='%23222' points='90 750 0 900 180 900'/%3E%3Cpolygon points='270 750 180 900 360 900'/%3E%3Cpolygon fill='%23DDD' points='270 750 360 600 180 600'/%3E%3Cpolygon points='450 750 540 600 360 600'/%3E%3Cpolygon points='630 750 540 900 720 900'/%3E%3Cpolygon fill='%23444' points='630 750 720 600 540 600'/%3E%3Cpolygon fill='%23AAA' points='810 750 720 900 900 900'/%3E%3Cpolygon fill='%23666' points='810 750 900 600 720 600'/%3E%3Cpolygon fill='%23999' points='990 750 900 900 1080 900'/%3E%3Cpolygon fill='%23999' points='180 0 90 150 270 150'/%3E%3Cpolygon fill='%23444' points='360 0 270 150 450 150'/%3E%3Cpolygon fill='%23FFF' points='540 0 450 150 630 150'/%3E%3Cpolygon points='900 0 810 150 990 150'/%3E%3Cpolygon fill='%23222' points='0 300 -90 450 90 450'/%3E%3Cpolygon fill='%23FFF' points='0 300 90 150 -90 150'/%3E%3Cpolygon fill='%23FFF' points='180 300 90 450 270 450'/%3E%3Cpolygon fill='%23666' points='180 300 270 150 90 150'/%3E%3Cpolygon fill='%23222' points='360 300 270 450 450 450'/%3E%3Cpolygon fill='%23FFF' points='360 300 450 150 270 150'/%3E%3Cpolygon fill='%23444' points='540 300 450 450 630 450'/%3E%3Cpolygon fill='%23222' points='540 300 630 150 450 150'/%3E%3Cpolygon fill='%23AAA' points='720 300 630 450 810 450'/%3E%3Cpolygon fill='%23666' points='720 300 810 150 630 150'/%3E%3Cpolygon fill='%23FFF' points='900 300 810 450 990 450'/%3E%3Cpolygon fill='%23999' points='900 300 990 150 810 150'/%3E%3Cpolygon points='0 600 -90 750 90 750'/%3E%3Cpolygon fill='%23666' points='0 600 90 450 -90 450'/%3E%3Cpolygon fill='%23AAA' points='180 600 90 750 270 750'/%3E%3Cpolygon fill='%23444' points='180 600 270 450 90 450'/%3E%3Cpolygon fill='%23444' points='360 600 270 750 450 750'/%3E%3Cpolygon fill='%23999' points='360 600 450 450 270 450'/%3E%3Cpolygon fill='%23666' points='540 600 630 450 450 450'/%3E%3Cpolygon fill='%23222' points='720 600 630 750 810 750'/%3E%3Cpolygon fill='%23FFF' points='900 600 810 750 990 750'/%3E%3Cpolygon fill='%23222' points='900 600 990 450 810 450'/%3E%3Cpolygon fill='%23DDD' points='0 900 90 750 -90 750'/%3E%3Cpolygon fill='%23444' points='180 900 270 750 90 750'/%3E%3Cpolygon fill='%23FFF' points='360 900 450 750 270 750'/%3E%3Cpolygon fill='%23AAA' points='540 900 630 750 450 750'/%3E%3Cpolygon fill='%23FFF' points='720 900 810 750 630 750'/%3E%3Cpolygon fill='%23222' points='900 900 990 750 810 750'/%3E%3Cpolygon fill='%23222' points='1080 300 990 450 1170 450'/%3E%3Cpolygon fill='%23FFF' points='1080 300 1170 150 990 150'/%3E%3Cpolygon points='1080 600 990 750 1170 750'/%3E%3Cpolygon fill='%23666' points='1080 600 1170 450 990 450'/%3E%3Cpolygon fill='%23DDD' points='1080 900 1170 750 990 750'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect x='0' y='0' fill='url(%23a)' width='100%25' height='100%25'/%3E%3Crect x='0' y='0' fill='url(%23b)' width='100%25' height='100%25'/%3E%3C/svg%3E");
    background-attachment: fixed;
    background-size: cover;


    #searchHeader {
        background: rgba(0, 106, 77, 0.8);
        width: 100%;
        margin-bottom:30px;
        padding:10px 0;
        color:#fff;
        text-align:left;
        text-indent:25px;
    }
`;

const SearchContainer = styled.div`
    background: rgba(255,255,255,0.7);
    position:absolute;
    min-width:720px;
    padding:0 0 30px 0;
    text-align:center;
    border-radius:5px;
    margin-top:-5%;
    @media screen and (max-width:520px){
        min-width:100%;
    }
    div > input {
        min-height:22px;
    }
`;

const Container = styled.div`

`;



// {/* <Combobox onSelect={handleSelect} aria-labelledby="demo">
//     <ComboboxInput
//         style={{ width: 300, maxWidth: "90%" }}
//         value={value}
//         onChange={handleInput}
//         disabled={!ready}
//         placeholder="Enter an address, city, or zip code."
//     />
//     <ComboboxPopover>
//         <ComboboxList>{status === "OK" && renderSuggestions()}</ComboboxList>
//     </ComboboxPopover>
// </Combobox> */}