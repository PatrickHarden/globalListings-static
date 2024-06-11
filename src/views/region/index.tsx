import React, { FC } from "react";
import styled from "styled-components";
//
import Layout from 'components/Layout';
import SEO from 'components/SEO';

interface Props {
    pageContext: any
}

const Region: FC<Props> = ({ pageContext: { region } }) => {

    return (
        <Layout>
            <SEO title="Property Types" />
            <h2>{region}</h2>
            <DataContainer>
                test
            </DataContainer>
        </Layout>
    )
}

export default Region;

const DataContainer = styled.div`
    display:block;
    float:left;
    max-width:100%;
  `
