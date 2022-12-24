import {useState} from "react"
import styled from "@emotion/styled";
import {IconButton} from "@mui/material";
import {CloseOutlined} from "@mui/icons-material";

const ConsentWrapper = styled.div<{isMobile: boolean, open: boolean}>`
  width: 100%;
  bottom: 0;
  position: sticky;
  background: #ffffffe6 0 0 no-repeat padding-box;
  box-shadow: 0px -1px 0px #989ea1;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  text-transform: uppercase;
  color: #000;
  border-bottom: 1px solid;
  border-top: 1px solid;
  padding: ${({isMobile}) => isMobile ? '24px' : '6px'} 50px ${({isMobile}) => isMobile ? '24px' : '6px'} 24px;
  display: ${({open}) => !open && 'none'};
`;

const CookieConsent = ({isMobile}: {isMobile: boolean}) => {
    const [open, setOpen] = useState<boolean>(typeof window !== 'undefined' ?
        localStorage.getItem('inan_CookieConsent') !== 'seen' : false
    )

    const handleClick = () => {
        localStorage.setItem(
            'inan_CookieConsent',
            'seen'
        )
        setOpen(false)
    }

    return (
        <ConsentWrapper open={open} isMobile={isMobile}>
            <IconButton onClick={handleClick} style={{position: 'absolute', right: '24px', top: isMobile ? '26px' : 0, padding: '5px'}}><CloseOutlined /></IconButton>
            We use cookies on this site to enhance your user experience By clicking any link on this page you are giving your consent for us to set cookies.
        </ConsentWrapper>
    )
}

export default CookieConsent