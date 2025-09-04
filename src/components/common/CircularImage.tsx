import React from "react";
import type {CircularImageProps} from "../../types";

export const CircularImage: React.FC<CircularImageProps> = ({
                                                                src,
                                                                alt,
                                                                size = "w-80 h-80 lg:w-96 lg:h-96",
                                                                className = "",
                                                                objectPosition = "center center"
                                                            }) => (
    <div className={`${size} rounded-full overflow-hidden shadow-xl border-4 border-white border-opacity-80 ${className}`}>
        <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            style={{
                objectPosition: objectPosition,
                objectFit: 'cover'
            }}
            loading="lazy"
        />
    </div>
);