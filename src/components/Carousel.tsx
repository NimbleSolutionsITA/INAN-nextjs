import {Children, cloneElement, ReactNode, useReducer, useRef, useState} from "react";
import {DOWN, SwipeEventData, UP, useSwipeable} from 'react-swipeable';
import {MobileStepper} from "@mui/material";
import styled from "@emotion/styled";

type CarouselProps = {
    children: ReactNode | ReactNode[]
}

type Direction = 'PREV' | 'NEXT';

interface CarouselState {
    pos: number;
    sliding: boolean;
    dir: Direction;
}

type CarouselAction =
    | { type: Direction, numItems: number }
    | { type: 'stopSliding' };

const getOrder = (index: number, pos: number, numItems: number) => {
    return index - pos < 0 ? numItems - Math.abs(index - pos) : index - pos;
};

const getInitialState = (numItems: number): CarouselState => ({ pos: numItems - 1, sliding: false, dir: 'NEXT' });

export const CarouselContainer = styled.div<{ sliding: boolean }>`
  display: flex;
  transition: ${(props) => (props.sliding ? "none" : "transform 1s ease")};
  transform: ${(props) => {
    if (!props.sliding) 
        return "translateX(calc(-100%))";
    if (props.dir === 'PREV') 
        return "translateX(calc(-200%))";
    return "translateX(0%)";
    }};
`;

export const CarouselSlot = styled.div<{ order: number }>`
  flex: 1 0 100%;
  flex-basis: 100%;
  order: ${(props) => props.order};
`;

const Wrapper = styled.div`
  width: 100%;
  overflow: hidden;
  flex-grow: 1;
  position: relative;
`;

const pattern = [UP, DOWN, UP, DOWN];

const Carousel = ({children}: CarouselProps) => {
    const numItems = Children.count(children);
    const [state, dispatch] = useReducer(reducer, getInitialState(numItems));
    const [pIdx, setPIdx] = useState(0);
    const loading = useRef(false)

    const slide = (dir: Direction) => {
        loading.current = true
        dispatch({ type: dir, numItems });
        setTimeout(() => {
            dispatch({ type: 'stopSliding' });
            setTimeout(() => {
                loading.current = false
            }, 1);
        }, 50);

    };

    const handleSwiped = (eventData: SwipeEventData) => {
        if (eventData.dir === pattern[pIdx]) {
            // user successfully got to the end of the pattern!
            if (pIdx + 1 === pattern.length) {
                setPIdx(pattern.length);
                slide('NEXT');
                setTimeout(() => {
                    setPIdx(0);
                }, 50);
            } else {
                // user is cont. with the pattern
                setPIdx((i) => (i += 1));
            }
        } else {
            // user got the next pattern step wrong, reset pattern
            setPIdx(0);
        }
    };

    const handlers = useSwipeable({
        onSwipedLeft: () => slide('NEXT'),
        onSwipedRight: () => slide('PREV'),
        onSwiped: handleSwiped,
        onTouchStartOrOnMouseDown: (({ event }) => {
            event.preventDefault()
            event.stopPropagation()
        }),
        touchEventOptions: { passive: false },
        swipeDuration: 500,
        preventScrollOnSwipe: true,
        trackMouse: true,
    });

    return (
        <Wrapper {...handlers}>
            <CarouselContainer dir={state.dir} sliding={state.sliding}>
                {Children.map(
                    // @ts-ignore
                    children,
                    (slot: JSX.Element, index) => slot && (
                        <CarouselSlot key={index} order={getOrder(index, state.pos, numItems)}>
                            {cloneElement(slot, {ref: loading})}
                        </CarouselSlot>
                    )
                )}
            </CarouselContainer>
            <MobileStepper
                variant="dots"
                steps={numItems}
                position="static"
                activeStep={state.pos}
                sx={{
                    position: 'absolute',
                    bottom: '6px',
                    width: '100%',
                    background: 'transparent',
                    flexDirection: 'column',
                    '& .MuiMobileStepper-dot': {
                        margin: '0 6px',
                        backgroundColor: '#666',
                    },
                    '& .MuiMobileStepper-dotActive': {
                        backgroundColor: '#333',
                    }
                }}
                backButton={null}
                nextButton={null}
            />
        </Wrapper>
    );
}



function reducer(state: CarouselState, action: CarouselAction): CarouselState {
    switch (action.type) {
        case 'PREV':
            return {
                ...state,
                dir: 'PREV',
                sliding: true,
                pos: state.pos === 0 ? action.numItems - 1 : state.pos - 1
            };
        case 'NEXT':
            return {
                ...state,
                dir: 'NEXT',
                sliding: true,
                pos: state.pos === action.numItems - 1 ? 0 : state.pos + 1
            };
        case 'stopSliding':
            return { ...state, sliding: false };
        default:
            return state;
    }
}

export default Carousel;