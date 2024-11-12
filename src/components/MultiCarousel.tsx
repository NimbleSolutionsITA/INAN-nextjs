import {Children, cloneElement, ReactNode} from "react";
import Carousel, {CarouselProps} from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styled from "@emotion/styled";
import {useIsMobile} from "../utils/layout";

type MultiCarouselProps = {
    children: ReactNode[]
} & Partial<CarouselProps>


const StyledCarousel = styled(Carousel)`
  .react-multi-carousel-dot-list {
    bottom: 10px;
  }
  .react-multi-carousel-dot button {
    border: none;
    background-color: #666;
    height: 8px;
    width: 8px;
    margin-right: 12px;
  }
  .react-multi-carousel-dot--active button {
    background: #000;
  }
`

const ButtonWrapper = styled.div`
  .react-multiple-carousel__arrow {
    background: transparent;
    top: calc(50% - 30px);
    z-index: 1200;
  }
  .react-multiple-carousel__arrow::before {
    color: #000;
  }
  .react-multiple-carousel__arrow:hover {
    background: transparent;
  }
  .react-multiple-carousel__arrow--left {
    left: -50px;
  }
  .react-multiple-carousel__arrow--right {
    right: -50px;
  }
`

const CustomButtonGroupAsArrows = ({ next, previous }: {next?: () => {}, previous?: () => {}}) => {
    return (
        <ButtonWrapper>
            <button
                onClick={() => previous && previous()}
                aria-label="Go to previous slide"
                className="react-multiple-carousel__arrow react-multiple-carousel__arrow--left"
            />
            <button
                onClick={() => next && next()}
                aria-label="Go to next slide"
                className="react-multiple-carousel__arrow react-multiple-carousel__arrow--right"
            />
        </ButtonWrapper>
    )
}

const MultiCarousel = ({children, ...props}: MultiCarouselProps) => {
    const isMobile = useIsMobile()
    return (
        <StyledCarousel
            arrows={false}
            customButtonGroup={!isMobile ? <CustomButtonGroupAsArrows /> : undefined}
            renderButtonGroupOutside={!isMobile}
            showDots={isMobile}
            additionalTransfrom={0}
            draggable
            focusOnSelect={false}
            infinite
            keyBoardControl
            minimumTouchDrag={80}
            responsive={{
                all: {
                    breakpoint: { max: 10000, min: 0 },
                    items: 1,
                },
            }}
            slidesToSlide={1}
            swipeable
            {...props}
        >
            {Children.map(children, (slide) => cloneElement(slide, {key: slide.toString()}))}
        </StyledCarousel>

    )
}

export default MultiCarousel