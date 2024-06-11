import React from 'react';
import { FooterWrapper } from './styles';
import CBRELOGO from '../../assets/images/cbre_white.png';

const Footer = () => (
  <FooterWrapper>
    <img src={CBRELOGO} alt="cbre logo" />
  </FooterWrapper>
);

export default Footer;
