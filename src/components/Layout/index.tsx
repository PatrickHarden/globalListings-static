import React from 'react';
import { ThemeProvider } from 'styled-components';
import { useSelector } from 'react-redux';
import { uiSelector } from 'state/ui';

import Header from 'components/Header';
import Footer from 'components/Footer';

import 'assets/styles/global.css';
import GlobalStyles from 'assets/styles/globalStyles';
import * as Theme from 'assets/styles/theme';
import { LayoutWrapper, MainWrapper } from './styles';

interface Props {
  children: React.ReactNode;
  text?: string
}

const Layout: React.FC<Props> = ({ children, text }) => {

  const { themeMode } = useSelector(uiSelector);

  return (
    <ThemeProvider theme={Theme[themeMode]}>
      <GlobalStyles />
      <LayoutWrapper>
        <Header siteTitle={'CBRE Properties'} text={text ? text : undefined} />
        <MainWrapper>{children}</MainWrapper>
        <Footer />
      </LayoutWrapper>
    </ThemeProvider>
  );
};

export default Layout;
