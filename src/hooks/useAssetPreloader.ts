// hooks/useAssetPreloader.ts
import { useEffect, useState, useRef, useMemo } from 'react';

interface Asset {
    url: string;
    type: 'image' | 'audio';
}

interface PreloaderResult {
    assetsLoaded: boolean;
    loadingProgress: number;
    loadedAssets: string[];
    failedAssets: string[];
    currentlyLoading: string;
}

export const useAssetPreloader = (assets: Asset[]): PreloaderResult => {
    const [assetsLoaded, setAssetsLoaded] = useState(false);
    const [loadedCount, setLoadedCount] = useState(0);
    const [loadedAssets, setLoadedAssets] = useState<string[]>([]);
    const [failedAssets, setFailedAssets] = useState<string[]>([]);
    const [currentlyLoading, setCurrentlyLoading] = useState('');

    // Memoize assets để tránh re-render vô tận
    const memoizedAssets = useMemo(() => assets, [JSON.stringify(assets)]);

    // Ref để track loading state
    const loadingRef = useRef<boolean>(false);

    useEffect(() => {
        if (memoizedAssets.length === 0) {
            setAssetsLoaded(true);
            return;
        }

        // Prevent multiple loading
        if (loadingRef.current) return;
        loadingRef.current = true;

        // Reset state
        setLoadedCount(0);
        setLoadedAssets([]);
        setFailedAssets([]);
        setAssetsLoaded(false);
        setCurrentlyLoading('');

        let completedCount = 0;
        const totalAssets = memoizedAssets.length;
        const loaded: string[] = [];
        const failed: string[] = [];

        const handleAssetComplete = (url: string, success: boolean) => {
            completedCount++;

            if (success) {
                loaded.push(url);
            } else {
                failed.push(url);
                console.warn(`Failed to load asset: ${url}`);
            }

            // Batch state updates
            setLoadedCount(completedCount);
            setLoadedAssets([...loaded]);
            setFailedAssets([...failed]);

            // Update currently loading
            if (completedCount < totalAssets) {
                const nextAsset = memoizedAssets[completedCount];
                const fileName = nextAsset.url.split('/').pop() || 'Unknown file';
                setCurrentlyLoading(fileName);
            } else {
                setCurrentlyLoading('Hoàn thành!');
                setTimeout(() => {
                    setAssetsLoaded(true);
                    setCurrentlyLoading('');
                    loadingRef.current = false;
                }, 300);
            }
        };

        // Start loading first asset
        if (memoizedAssets[0]) {
            const fileName = memoizedAssets[0].url.split('/').pop() || 'Loading...';
            setCurrentlyLoading(fileName);
        }

        // Process each asset
        memoizedAssets.forEach(({ url, type }) => {
            if (type === 'image') {
                const img = new Image();
                img.onload = () => handleAssetComplete(url, true);
                img.onerror = () => handleAssetComplete(url, false);
                img.src = url;
            } else if (type === 'audio') {
                const audio = new Audio();
                audio.preload = 'auto';

                let hasResolved = false;

                const resolveOnce = (success: boolean) => {
                    if (!hasResolved) {
                        hasResolved = true;
                        handleAssetComplete(url, success);
                        cleanup();
                    }
                };

                const handleCanPlay = () => resolveOnce(true);
                const handleError = () => resolveOnce(false);

                const timeout = setTimeout(() => {
                    resolveOnce(true);
                }, 5000);

                const cleanup = () => {
                    clearTimeout(timeout);
                    audio.removeEventListener('canplaythrough', handleCanPlay);
                    audio.removeEventListener('loadeddata', handleCanPlay);
                    audio.removeEventListener('error', handleError);
                };

                audio.addEventListener('canplaythrough', handleCanPlay);
                audio.addEventListener('loadeddata', handleCanPlay);
                audio.addEventListener('error', handleError);

                audio.src = url;
                audio.load();
            }
        });

        // Cleanup function
        return () => {
            loadingRef.current = false;
        };

    }, [memoizedAssets]);

    const progress = memoizedAssets.length > 0 ? Math.round((loadedCount / memoizedAssets.length) * 100) : 100;

    return {
        assetsLoaded,
        loadingProgress: progress,
        loadedAssets,
        failedAssets,
        currentlyLoading
    };
};

// Hook đơn giản chỉ cho audio
export const useAudioPreloader = (audioUrls: string[]) => {
    const assets = useMemo(() =>
            audioUrls.map(url => ({ url, type: 'audio' as const })),
        [audioUrls.join(',')]
    );
    return useAssetPreloader(assets);
};

// Hook đơn giản chỉ cho images
export const useImagePreloader = (imageUrls: string[]) => {
    const assets = useMemo(() =>
            imageUrls.map(url => ({ url, type: 'image' as const })),
        [imageUrls.join(',')]
    );
    return useAssetPreloader(assets);
};