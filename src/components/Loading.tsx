import styled from "@emotion/styled";
import {Typography} from "@mui/material";
import Container from "./Container";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {useRouter} from "next/router";
import {useIsMobile} from "../utils/layout";

const Waivy = styled.div`
  position: relative;
  font-size: 60px;
  @keyframes waviy {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

const Letter = styled.span<{ delay: number}>`
  position: relative;
  display: inline-block;
  color: #000;
  text-transform: uppercase;
  animation: waviy 1.4s infinite;
  animation-delay: calc(.2s * ${({delay}) => delay});
`

const Loading = () => {
    const {isFallback} = useRouter()
    const { loading } = useSelector((state: RootState) => state.header);
    const isMobile = useIsMobile()
    const letters = '...'.split('')
    return (loading || isFallback) ? (
        <div style={{width: !isMobile ? '100%' : undefined, paddingBottom: '40px'}}>
            <div style={{borderBottom: isMobile ? '1px solid black' : undefined}}>
                <Container style={{display: 'flex'}}>
                    <Waivy>
                        <Typography variant="h1" component="span">LOADING</Typography>
                        {letters.map((letter, index) =>
                            <Typography key={letter+index} variant="h1" component={Letter} delay={index}>{letter}</Typography>
                        )}
                    </Waivy>
                </Container>
            </div>
        </div>
    ) : null
}

export default Loading