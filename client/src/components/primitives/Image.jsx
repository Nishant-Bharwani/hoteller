import React from "react";

const Image = ({ src, alt, height, width, ...rest }) => {
    return <img src={src} alt={alt} height={height} width={width} {...rest} />;
};

export default Image;
