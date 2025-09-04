import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router";
import WeddingInvitation from "./components/WeddingInvitation.tsx";
import WeddingMusic from "./components/WeddingMusic.tsx";
import {Thankful} from "./components/Thankful.tsx";
import {useAssetPreloader} from "./hooks/useAssetPreloader.ts";
import {LoadingScreen} from "./components/LoadingScreen.tsx";

const App: React.FC = () => {
    const assets = [
        // Load images first (faster)
        { url: 'https://3utqeqt0pa7xbazg.public.blob.vercel-storage.com/images/Background.webp', type: 'image' as const },
        { url: 'https://3utqeqt0pa7xbazg.public.blob.vercel-storage.com/images/HeroCouple.webp', type: 'image' as const },
        { url: 'https://3utqeqt0pa7xbazg.public.blob.vercel-storage.com/images/GalleryCouple.webp', type: 'image' as const },
        { url: 'https://3utqeqt0pa7xbazg.public.blob.vercel-storage.com/musics/BackgroundMusic.mp3', type: 'audio' as const }
    ];

    const {
        assetsLoaded,
        loadingProgress,
        loadedAssets,
        failedAssets,
        currentlyLoading
    } = useAssetPreloader(assets);

    if (!assetsLoaded) {
        return (
            <LoadingScreen
                progress={loadingProgress}
                loadedAssets={loadedAssets}
                failedAssets={failedAssets}
                currentlyLoading={currentlyLoading}
            />
        );
    }

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="" element={<WeddingMusic />} />
                    <Route path="/home" element={<WeddingInvitation />} />
                    <Route path="/thankful" element={<Thankful />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;