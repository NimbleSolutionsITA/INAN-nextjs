import HomeCover from "./HomeCover";
import {createRef, Dispatch, RefObject, SetStateAction, useEffect, useRef} from "react";
import {Cover} from "../../../utils/layout";
import {useBrowserLayoutEffect} from "../../../utils/helpers";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {setHeader} from "../../../redux/headerSlice";

type HomeCoversProps = {
    showContent: boolean
    setShowContent: Dispatch<SetStateAction<boolean>>,
    setCurrentCoverIndex: Dispatch<SetStateAction<number>>,
    currentCover: Cover
    currentCoverIndex: number
    covers: Cover[]
}

const HomeCovers = ({covers, showContent, setShowContent, currentCoverIndex, setCurrentCoverIndex, currentCover }: HomeCoversProps) => {
    const { isMobile } = useSelector((state: RootState) => state.header);
    const dispatch = useDispatch()
    const arrLength = covers?.length;
    const elRefs = useRef<RefObject<HTMLDivElement>[]>([]);

    if (elRefs.current.length !== arrLength) {
        // add or remove refs
        elRefs.current = Array(arrLength).fill(undefined, undefined, undefined)
            .map((_, i) => elRefs.current[i] || createRef<HTMLDivElement>());
    }

    useEffect(() => {
        if(covers && window.scrollY === 0) {
            dispatch(setHeader({ headerColor: covers[0].color, headerColorMobile: covers[0].colorMobile}))
            setCurrentCoverIndex(0)
        }
    }, [currentCoverIndex]);


    useBrowserLayoutEffect(() => {

        let throttleTimeout: NodeJS.Timeout | null
        const wait = 250
        const callBack = () => {
            if (elRefs.current[0].current) {
                elRefs.current.forEach((h, i) => {
                    if (
                        h.current &&
                        h.current.getBoundingClientRect().top < 200 &&
                        h.current.getBoundingClientRect().bottom > 200 &&
                        i !== currentCoverIndex
                    ) {
                        dispatch(setHeader({ headerColor: covers[i].color, headerColorMobile: covers[i].colorMobile}))
                        setCurrentCoverIndex(i)
                    }
                })
            }
            throttleTimeout = null
        }

        const handleScroll = () => {
            if (wait) {
                if (throttleTimeout === null) {
                    throttleTimeout = setTimeout(callBack, wait)
                }
            } else {
                callBack()
            }
        }
        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll)
    }, [currentCover, elRefs])

    const getCoverHeight = typeof window !== 'undefined' ? (index: number) => {
        if (typeof window !== 'undefined' && index === arrLength - 1) {
            return isMobile ? window.innerHeight - 520 : window.innerHeight - 150
        }
        return undefined
    } : (index: number) => 500

    return (
        <>
            {covers && covers.map((cover, index) => (
                <div key={cover.id} ref={elRefs.current[index]} style={{minHeight: getCoverHeight(index)}}>
                    <HomeCover
                        bg={cover.bg}
                        bgMobile={cover.bgMobile}
                        title={cover.title}
                        color={cover.color}
                        colorMobile={cover.colorMobile}
                        video={cover.video}
                        isCover={cover.isCover}
                        isCoverMobile={cover.isCoverMobile}
                        loop={cover.loop}
                        autoplay={cover.autoplay}
                        mute={cover.mute}
                        isMobile={isMobile}
                        showContent={showContent}
                        setShowContent={setShowContent}
                    />
                </div>
            ))}
        </>
    )
}

export default HomeCovers