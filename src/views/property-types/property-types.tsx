import React, { FC } from "react";
import styled from "styled-components";
//
import Layout from 'components/Layout';
import SEO from 'components/SEO';

interface Props {
    pageContext: any
}

const PropertyTypes: FC<Props> = ({ pageContext: { region } }) => (
    <Layout>
    <SEO title="Property Types" />
        <h2>PDP</h2>
        <DataContainer>
            test
        </DataContainer>
    </Layout>
)

export default PropertyTypes;

const DataContainer = styled.div`
    display:block;
    float:left;
    max-width:100%;
  `
