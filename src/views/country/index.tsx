import React, { FC } from "react";
import styled from "styled-components";
import { Link } from "gatsby";
//
import Layout from 'components/Layout';
import SEO from 'components/SEO';

interface Props {
    pageContext: any
}

const Country: FC<Props> = ({ pageContext: { countryName  } }) => {

    // const countries = countryInfo.sort((a: any, b: any) => {
    //     var textA = a.countryName.toUpperCase();
    //     var textB = b.countryName.toUpperCase();
    //     return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    // });

    return (
        <Layout>
            <SEO title="Property Types" />
            <h1>{countryName}</h1>
            <DataContainer>
                {/* <ul>
                    {countryLeaseRegionData.map((regions: any) => (
                        regions.regions.map((region: any) => (
                            <li key={region.region}><Link to={'/properties/' + countryName + '/' + region.region}>{region.region}</Link></li>
                        ))
                    ))}
                    {countrySaleRegionData.map((regions: any) => (
                        regions.regions.map((region: any) => (
                            <li key={region.region}><Link to={'/properties/' + countryName + '/' + region.region}>{region.region}</Link></li>
                        ))
                    ))}
                </ul> */}
            </DataContainer>
        </Layout>
    )
}


export default Country;

const DataContainer = styled.div`
    display:block;
    float:left;
    max-width:100%;
  `
