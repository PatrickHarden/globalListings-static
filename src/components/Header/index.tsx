import React from 'react';
import { Link } from 'gatsby';

import MainNav from './MainNav';
import SwitchThemeMode from './SwitchThemeMode';

import { HeaderWrapper, Title } from './styles';

interface Props {
  siteTitle: string,
  text?: any
}

const Header: React.FC<Props> = ({ siteTitle, text }) => (
  <HeaderWrapper>
    <MainNav text={text} />
  </HeaderWrapper>
);

Header.defaultProps = {
  siteTitle: ``
};

export default Header;
