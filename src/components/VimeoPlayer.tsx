import {Dispatch, SetStateAction, useState} from "react";
import Vimeo from '@u-wave/react-vimeo';
import styled from "@emotion/styled";
import {Typography} from "@mui/material";

type VimeoPlayerProps = {
    autoplay?: boolean
    loop?: boolean
    mute?: boolean
    video: string
    color: string
    background?: boolean
    cover?: false | { url: string }
    setShowContent?: Dispatch<SetStateAction<boolean>>
}

const WatchButton = styled.div`
  margin: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  cursor: pointer;
  :hover {
    text-decoration: line-through;
  }
  h1 {
      position: absolute;
      top: 50%;
      width: 100%;
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
        padding: 70% 0;
  }
`;

const VimeoPlayer = ({autoplay = true, video, loop = true, mute = true, color, background, cover, setShowContent}: VimeoPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(autoplay)
    const handlePlay = () => {
        setIsPlaying(true)
        setShowContent && setShowContent(false)
    }
    const handlePause = () => {
        setIsPlaying(false)
        setShowContent && setShowContent(true)
    }

    return video ? (
        <div style={{position: 'relative', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: cover ? `url(${cover.url})` : undefined}}>
            <Vimeo
                style={{opacity: (!isPlaying && cover) ? 0 : 1}}
                paused={!isPlaying}
                onPlay={handlePlay}
                onPause={handlePause}
                video={video}
                color={color.substring(1)}
                responsive={true}
                background={background}
                showTitle={false}
                showPortrait={false}
                showByline={false}
                autoplay={autoplay}
                loop={loop}
                muted={mute}
            />
            <WatchButton style={{color, display: isPlaying ? 'none' : 'block'}}>
                <Typography
                    style={{color}}
                    variant="h1"
                    onClick={handlePlay}
                >
                    WATCH
                </Typography>
            </WatchButton>
        </div>
    ) : <span />
}

export default VimeoPlayer