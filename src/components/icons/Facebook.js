import * as React from "react";
const SvgFacebook = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    style={{
      enableBackground: "new 0 0 40 40",
    }}
    xmlSpace="preserve"
    {...props}
  >
    <linearGradient
      id="facebook_svg__a"
      gradientUnits="userSpaceOnUse"
      x1={-277.375}
      y1={406.602}
      x2={-277.375}
      y2={407.573}
      gradientTransform="matrix(40 0 0 -39.7778 11115.001 16212.334)"
    >
      <stop
        offset={0}
        style={{
          stopColor: "#0062e0",
        }}
      />
      <stop
        offset={1}
        style={{
          stopColor: "#19afff",
        }}
      />
    </linearGradient>
    <path
      d="M16.7 39.8C7.2 38.1 0 29.9 0 20 0 9 9 0 20 0s20 9 20 20c0 9.9-7.2 18.1-16.7 19.8l-1.1-.9h-4.4l-1.1.9z"
      style={{
        fill: "url(#facebook_svg__a)",
      }}
    />
    <path
      d="m27.8 25.6.9-5.6h-5.3v-3.9c0-1.6.6-2.8 3-2.8H29V8.2c-1.4-.2-3-.4-4.4-.4-4.6 0-7.8 2.8-7.8 7.8V20h-5v5.6h5v14.1c1.1.2 2.2.3 3.3.3 1.1 0 2.2-.1 3.3-.3V25.6h4.4z"
      style={{
        fill: "#fff",
      }}
    />
  </svg>
);
export default SvgFacebook;
