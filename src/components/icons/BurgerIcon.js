import React from "react";
import styled from '@emotion/styled'

const IconWrapper = styled.div`
  width: 18px;
  height: 16px;
  position: relative;
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-transition: .5s ease-in-out;
  -moz-transition: .5s ease-in-out;
  -o-transition: .5s ease-in-out;
  transition: .5s ease-in-out;
  cursor: pointer;
  span.open:nth-child(1) {
    top: 8px;
    width: 0;
    left: 50%;
  }
  span.open:nth-child(2) {
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  span.open:nth-child(3) {
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  span.open:nth-child(4) {
    top: 8px;
    width: 0;
    left: 50%;
  }
`;

const Bar = styled.span`
  display: block;
  position: absolute;
  height: 1px;
  width: 100%;
  background: ${({color}) => color};
  border-radius: 9px;
  opacity: 1;
  left: 0;
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-transition: .25s ease-in-out;
  -moz-transition: .25s ease-in-out;
  -o-transition: .25s ease-in-out;
  transition: .25s ease-in-out;
  :nth-child(1) {
    top: 0;
  } 
  :nth-child(2), :nth-child(3) {
    top: 8px;
  } 
  :nth-child(4) {
    top: 16px;
  } 
`;

const BurgerIcon = ({color = '#000', open}) => {
    return (
        <IconWrapper >
            <Bar className={open ? 'open' : ''} color={color} />
            <Bar className={open ? 'open' : ''} color={color} />
            <Bar className={open ? 'open' : ''} color={color} />
            <Bar className={open ? 'open' : ''} color={color} />
        </IconWrapper>
    )
}

export default BurgerIcon;