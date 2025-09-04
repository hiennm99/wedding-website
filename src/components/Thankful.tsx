import React from "react";
// import GalleryCouple from "../assets/images/GalleryCouple.webp";
import {CircularImage} from "./common/CircularImage.tsx";

const GalleryCouple = 'https://3utqeqt0pa7xbazg.public.blob.vercel-storage.com/images/GalleryCouple.webp';

export const Thankful: React.FC = () => {
    return (
        <section className="py-20 px-4 relative overflow-hidden min-h-screen">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-blue-50 to-rose-100" />

            <div className="w-full h-full relative z-10 flex items-center">
                <div className="w-full">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16 px-8 lg:px-16">
                        <div className="lg:w-1/2 flex justify-center order-2 lg:order-1">
                            <CircularImage
                                src={GalleryCouple}
                                alt="See you there"
                                size="w-80 h-80 lg:w-96 lg:h-96"
                            />
                        </div>

                        <div className="lg:w-1/2 text-center lg:text-left order-1 lg:order-2 lg:pr-8">
                            <h2 className="text-3xl lg:text-4xl xl:text-6xl font-['Allura'] text-rose-600 mb-8 leading-tight">
                                Sự hiện diện của mọi người sẽ làm cho ngày đặc biệt của chúng tôi thêm ý nghĩa và trọn vẹn hơn.
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};