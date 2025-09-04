import React from 'react';

interface LoadingScreenProps {
    progress: number;
    loadedAssets?: string[];
    failedAssets?: string[];
    currentlyLoading?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
                                                                progress,
                                                                loadedAssets = [],
                                                                failedAssets = [],
                                                                currentlyLoading = ''
                                                            }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-blue-50 to-rose-100">
            <div className="text-center max-w-md px-6">
                {/* Loading spinner */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-pink-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-pink-500 rounded-full animate-spin"></div>
                    {/* Inner spinner for audio */}
                    <div className="absolute inset-2 border-2 border-rose-300 rounded-full"></div>
                    <div className="absolute inset-2 border-2 border-transparent border-b-rose-400 rounded-full animate-spin" style={{animationDirection: 'reverse'}}></div>
                </div>

                {/* Couple names */}
                <h2 className="text-3xl font-['Allura'] text-rose-600 mb-4">
                    Hiền & Vi
                </h2>

                {/* Loading message */}
                <p className="text-pink-500 mb-2">
                    Đang chuẩn bị ảnh và nhạc nền...
                </p>

                {/* Currently loading */}
                {currentlyLoading && (
                    <p className="text-pink-400 text-sm mb-4 min-h-[20px]">
                        {currentlyLoading}
                    </p>
                )}

                {/* Progress bar */}
                <div className="w-full bg-pink-100 rounded-full h-3 mb-3 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-pink-400 to-rose-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Progress text */}
                <div className="flex justify-between items-center text-sm mb-4">
                    <span className="text-pink-400">{progress}%</span>
                    <span className="text-pink-300">
            {loadedAssets.length}/{loadedAssets.length + failedAssets.length}
          </span>
                </div>

                {/* Asset status */}
                <div className="text-xs text-gray-500 space-y-1">
                    {loadedAssets.length > 0 && (
                        <p className="text-green-600">✅ Đã tải: {loadedAssets.length}</p>
                    )}
                    {failedAssets.length > 0 && (
                        <p className="text-red-500">❌ Lỗi: {failedAssets.length}</p>
                    )}
                </div>
            </div>
        </div>
    );
};