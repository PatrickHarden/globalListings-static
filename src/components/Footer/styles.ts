import styled from 'styled-components';

export const FooterWrapper = styled.footer`
  width: 100%;
  border-color: ${({ theme }) => theme.colors.border};
  display:block;
  float:left;
  background:#006a4d;
  padding:30px 0;
  > p {
    width: 90%;
    margin: 0 auto;
    color:#fff;
  }
  > img {
    margin-left:5%;
    max-height:22px;
  }
`;
