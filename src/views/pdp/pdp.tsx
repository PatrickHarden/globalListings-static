import React, { FC } from "react";
import styled from "styled-components";
//
import Layout from 'components/Layout';
import SEO from 'components/SEO';

interface Props {
    pageContext: any
}

const PDP: FC<Props> = ({ pageContext: { listing, siteId, countryName, pdpConfig } }) => {

    const description = listing['Common.LongDescription'] && listing['Common.LongDescription'][0] && listing['Common.LongDescription'][0]['Common.Text'];
    // console.log(listing, description)

    return (
        <Layout>
            <SEO title="CBRE Properties" />
            <DataContainer>
                <h2>PDP</h2>
                {listing['Common.Photos'] && listing['Common.Photos'][0] && listing['Common.Photos'][0]['Common.ImageResources'][0]['Common.Resource.Uri'] && 
                    <img src={'https://www.cbre.us' + listing['Common.Photos'][0]['Common.ImageResources'][0]['Common.Resource.Uri']} />
                }
                <p>
                    {description}
                </p>
            </DataContainer>
        </Layout>
    )
}


const DataContainer = styled.div`
    display:block;
    max-width:90%;
    overflow:hidden;
    margin: 0 auto;
    img, p {
        max-width: 600px;
    }
    p {
        margin-top:30px;
    }
  `

export default PDP;