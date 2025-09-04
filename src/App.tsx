import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router";
import WeddingInvitation from "./components/WeddingInvitation.tsx";
import WeddingMusic from "./components/WeddingMusic.tsx";
import {Thankful} from "./components/Thankful.tsx";
import {useAssetPreloader} from "./hooks/useAssetPreloader.ts";
import {LoadingScreen} from "./components/LoadingScreen.tsx";

// Navigation Context
interface NavigationContextType {
    hasVisitedHome: boolean;
    setHasVisitedHome: (value: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType>({
    hasVisitedHome: false,
    setHasVisitedHome: () => {}
});

// Navigation Provider - chỉ dùng in-memory state
const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Luôn bắt đầu với false, không lưu vào storage
    const [hasVisitedHome, setHasVisitedHome] = useState(false);

    return (
        <NavigationContext.Provider value={{ hasVisitedHome, setHasVisitedHome }}>
            {children}
        </NavigationContext.Provider>
    );
};

// Hook để sử dụng navigation context
const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within NavigationProvider');
    }
    return context;
};

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { hasVisitedHome } = useNavigation();

    if (!hasVisitedHome) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

// Wedding Music component với tracking
const WeddingMusicWithTracking: React.FC = () => {
    const { setHasVisitedHome } = useNavigation();

    useEffect(() => {
        setHasVisitedHome(true);
    }, [setHasVisitedHome]);

    return <WeddingMusic />;
};

const AppRoutes: React.FC = () => {
    const assets = [
        { url: 'https://3utqeqt0pa7xbazg.public.blob.vercel-storage.com/images/Background.webp', type: 'image' as const },
        { url: 'https://3utqeqt0pa7xbazg.public.blob.vercel-storage.com/images/HeroCouple.webp', type: 'image' as const },
        { url: 'https://3utqeqt0pa7xbazg.public.blob.vercel-storage.com/images/GalleryCouple.webp', type: 'image' as const },
        { url: 'https://3utqeqt0pa7xbazg.public.blob.vercel-storage.com/images/WeddingCard.webp', type: 'image' as const },
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
        <div className="App">
            <Routes>
                <Route path="/" element={<WeddingMusicWithTracking />} />
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <WeddingInvitation />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/thankful"
                    element={
                        <ProtectedRoute>
                            <Thankful />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <NavigationProvider>
            <Router>
                <AppRoutes />
            </Router>
        </NavigationProvider>
    );
};

export default App;