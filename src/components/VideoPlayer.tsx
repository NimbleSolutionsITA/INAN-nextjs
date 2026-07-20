import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import styled from "@emotion/styled";
import {Typography} from "@mui/material";

type VideoPlayerProps = {
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

const VideoPlayer = ({autoplay = true, video, loop = true, mute = true, color, background, cover, setShowContent}: VideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = useState(autoplay)

    // React does not reliably reflect the `muted` prop to the DOM attribute,
    // which browsers require for autoplay. Set it imperatively.
    useEffect(() => {
        if (videoRef.current) videoRef.current.muted = mute
    }, [mute])

    const handlePlay = () => {
        setIsPlaying(true)
        setShowContent && setShowContent(false)
        videoRef.current?.play().catch(() => {})
    }
    const handlePause = () => {
        setIsPlaying(false)
        setShowContent && setShowContent(true)
    }

    return video ? (
        <div style={{position: 'relative', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: cover ? `url(${cover.url})` : undefined}}>
            <video
                ref={videoRef}
                src={video}
                poster={cover ? cover.url : undefined}
                style={{width: '100%', height: 'auto', display: 'block', opacity: (!isPlaying && cover) ? 0 : 1, accentColor: color}}
                autoPlay={autoplay}
                loop={loop}
                muted={mute}
                playsInline
                controls={isPlaying && !background}
                onPlay={handlePlay}
                onPause={handlePause}
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

export default VideoPlayer
