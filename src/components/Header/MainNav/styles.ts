import styled from 'styled-components';

interface NavProps {
  open: boolean;
}

export const Nav = styled.nav<NavProps>`
  ${({ open }) => !open && `visibility: visible`};
`;

export const Container = styled.div`
    border-bottom: 1px solid #ccc;
    position:sticky;
    top:0;
    background:#fff;
    z-index:2;
`;

export const Header = styled.div`
    font-family: sans-serif;
    max-width:90%;
    margin:0 auto;
    align-items: center;
    justify-items: center;
    display: flex;
    min-height:80px;
`;

export const SubNav = styled.div`
    background:#006a4d;
    width:100%;
    min-height:40px;
    align-items: center;
    display: flex;
    h5 {
        text-transform:capitalize;
        color:#fff;
        font-family:sans-serif;
        margin:0;
        margin-left:5%;
    }
`;

export const BackButton = styled.div`
    color:#fff;
    margin-left:5%;
    cursor:pointer;
`;
