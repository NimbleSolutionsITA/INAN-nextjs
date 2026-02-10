// src/components/NewsFeed/index.tsx
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, useMediaQuery } from "@mui/material";
import Container from "../../Container";
import { NewsFeed as NewsFeedType } from "../../../utils/layout";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";

type NewsFeedProps = {
    currentNews: NewsFeedType[];
};

const FADE_DURATION_MS = 500;
const ROTATE_INTERVAL_MS = 12000;
const SCROLL_DURATION_SEC = 12;

const NewsFeed = ({ currentNews }: NewsFeedProps) => {
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);
    const [shouldScroll, setShouldScroll] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const { headerColorMobile, headerColor} = useSelector((state: RootState) => state.header);

    useEffect(() => {
        if (!currentNews || currentNews.length <= 1) return;

        const interval = setInterval(() => {
            setVisible(false);

            setTimeout(() => {
                setIndex((prev) => (prev + 1) % currentNews.length);
                setVisible(true);
            }, FADE_DURATION_MS);
        }, ROTATE_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [currentNews]);

    useEffect(() => {
        const container = containerRef.current;
        const text = textRef.current;
        if (!container || !text) return;

        setShouldScroll(text.scrollWidth > container.clientWidth);
    }, [index]);

    if (!currentNews || currentNews.length === 0) return <span />;

    const content = (
        <Box
            ref={containerRef}
            sx={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                opacity: visible ? 1 : 0,
                transition: `opacity ${FADE_DURATION_MS}ms ease-in-out`,
            }}
        >
            <Box
                ref={textRef}
                sx={{
                    display: "inline-block",
                    paddingLeft: shouldScroll ? "100%" : 0,
                    animation: shouldScroll
                        ? `ticker ${SCROLL_DURATION_SEC}s linear infinite`
                        : "none",
                }}
                dangerouslySetInnerHTML={{ __html: currentNews[index].title }}
            />
        </Box>
    );

    return (
        <Box
            sx={{
                width: "100%",
                textTransform: "uppercase",
                borderBottom: isMobile ? "none" : "1px solid",
                borderTop: isMobile ? "1px solid" : "none",
                lineHeight: '24px',
                fontSize: '20px',
                fontWeight: 'bold',
                color: isMobile ? headerColorMobile : headerColor,
            }}
        >
            {isMobile ? <Container>{content}</Container> : content}

            {/* keyframes */}
            <style>
                {`
          @keyframes ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
        `}
            </style>
        </Box>
    );
};

export default NewsFeed;