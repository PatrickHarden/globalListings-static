import React, { useState } from 'react';
import { Link } from 'gatsby';
// es:lint disable-next-line
import Logo from 'assets/images/CBREGL-LOGO.png'
import { Container, Header, SubNav } from './styles';

interface NavItem {
  title: string;
  slug: string;
  text?: any
}


const MainNav: React.FC<any> = ({ text }) => {
  const [open, setOpen] = useState(false);

  return (
    <Container>
        <Header>
            <Link to="/"  >
                <img src={Logo} alt="CBRE Global Listings" />
            </Link>
        </Header>
        <SubNav>
            {text && 
                <span style={{marginLeft: '5%', color: '#fff'}}>{text}</span>
            }
            {/* {((typeof window !== 'undefined') && window.location.pathname !== '/') &&
                <BackButton onClick={() => {
                    // eslint-disable-next-line no-restricted-globals
                    typeof history !== 'undefined' && history.go(-1)
                }}>Back</BackButton>
            } */}
            {/* <h5>
                {props.page}
            </h5> */}
        </SubNav>
    </Container>
  );
};

export default MainNav;
