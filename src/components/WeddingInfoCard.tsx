import React from "react";
import {FaMapLocation} from "react-icons/fa6";
import {WeddingCalendar} from "./WeddingCalendar.tsx";
import {WEDDING_INFO} from "./constants";

export const WeddingInfoCard: React.FC = () => (
    <div className="bg-white bg-opacity-90 backdrop-blur-md border border-pink-200 rounded-3xl mt-12 p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full transform -translate-x-12 -translate-y-12 opacity-60" />
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-rose-100 to-pink-100 rounded-full transform translate-x-10 translate-y-10 opacity-60" />

        <div className="relative z-10">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <WeddingCalendar />
                </div>

                <div className="space-y-4">
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200 shadow-lg h-full flex flex-col justify-center">
                        <div className="flex items-start gap-4">
                            <div className="bg-white rounded-2xl p-4 shadow-md border border-pink-200 flex-shrink-0">
                                <FaMapLocation className="w-8 h-8 text-rose-500"/>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-rose-600 font-semibold mb-2 text-lg">{WEDDING_INFO.venue}</h4>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <a
                                href="https://maps.app.goo.gl/pEpZV62sEixZvXgC7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <FaMapLocation />
                                <span>Xem trên Google Maps</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);