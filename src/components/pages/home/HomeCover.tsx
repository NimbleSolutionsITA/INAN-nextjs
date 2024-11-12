import Container from "../../Container";
import styled from "@emotion/styled";
import {Typography} from "@mui/material";
import VimeoPlayer from "../../VimeoPlayer";
import {Dispatch, SetStateAction} from "react";

type HomeCoverProps = {
    bg: string
    isMobile: boolean
    bgMobile?: string | undefined
    title: string
    isCover: boolean
    isCoverMobile: boolean
    color: string
    colorMobile: string
    video: string | undefined
    loop: boolean
    autoplay: boolean
    mute: boolean
    showContent: boolean
    setShowContent: Dispatch<SetStateAction<boolean>>
}

const CoverWrapper = styled.div<{hasBgImage: boolean, hasVideo: boolean, bg: string | undefined, isCoverMobile: boolean, isCover: boolean, isMobile: boolean}>`
  min-height:  auto;
  width: 100%;
  text-transform: uppercase;
  background-image: ${({hasBgImage, bg}) => hasBgImage ? `url(${bg})` : 'none'};
  background-size: cover;
  background-position: center;
  background-color: ${({hasVideo}) => hasVideo ? '#000' : '#fff'};
  overflow: hidden;
  margin-top: ${({isCover, isMobile}) => isCover ? (isMobile ? '-84px' : '-103px') : undefined}};  
`;

const PortraitImageWrapper = styled.div<{ isMobile: boolean }>`
  margin: ${({isMobile}) => isMobile ? '0 auto' : '0 auto 80px'};
  width: ${({isMobile}) => isMobile ? '100%' : '66%'};
  display: ${({isMobile}) => isMobile ? '' : 'grid'};
  & img {
    width: 100%;
  }
`;

const HomeCover = ({bg, bgMobile, title, isCover, isCoverMobile, color, colorMobile, video, loop, autoplay, mute, showContent, setShowContent, isMobile}: HomeCoverProps) => {
    return(
        <CoverWrapper
            hasBgImage={(isMobile ? isCoverMobile : isCover) || (!!video && showContent)}
            hasVideo={!!video}
            bg={!video ? (isMobile ? bgMobile || bg : bg) : undefined}
            isCover={isCover}
            isCoverMobile={isCoverMobile}
            isMobile={isMobile}
        >
            {!video && isMobile && isCoverMobile && <img src={bgMobile || bg} alt="" style={{width: '100%', opacity: 0}} />}
            {!video && !isMobile && isCover && <img src={bg} alt="" style={{width: '100%', opacity: 0}} />}
            {video ? (
                <VimeoPlayer
                    cover={{url: isMobile ? bgMobile || bg : bg}}
                    video={video}
                    loop={loop}
                    autoplay={autoplay}
                    color={isMobile ? colorMobile : color}
                    mute={mute}
                    setShowContent={setShowContent}
                />
            ) : (
                <Container>
                    {((!isCover && !isMobile) || (!isCoverMobile && isMobile)) && (
                        <>
                            <Typography
                                sx={{
                                    paddingTop: 0,
                                    textTransform: 'uppercase',
                                    marginLeft: '-3px',
                                    opacity: 0,
                                    width: {xs: '100%', md: 'calc(100% - 80px)'},
                                    paddingBottom: {xs: '16px', md: '3px'},
                                    lineHeight: '60px'

                                }}
                                variant="h1"
                                component="h1"
                            >
                                {title}
                            </Typography>
                            <PortraitImageWrapper isMobile={isMobile}>
                                <img alt={title} width="100%" src={isMobile ? bgMobile : bg} />
                            </PortraitImageWrapper>
                        </>
                    )}
                </Container>
            )}
        </CoverWrapper>
    )
}

export default HomeCover;