// Clear browser cache for Next.js assets
(function () {
    console.log('📣 Attempting to clear browser cache for Next.js assets...');

    // Clear application cache if available
    if (window.applicationCache && window.applicationCache.swapCache) {
        try {
            window.applicationCache.swapCache();
            console.log('✅ Application cache cleared');
        } catch (e) {
            console.log('⚠️ Could not clear application cache: ', e);
        }
    }

    // Clear local storage for any cached asset paths
    try {
        const nextKeys = Object.keys(localStorage).filter(key =>
            key.includes('next') || key.includes('__next')
        );

        if (nextKeys.length) {
            nextKeys.forEach(key => localStorage.removeItem(key));
            console.log(`✅ Cleared ${nextKeys.length} Next.js related items from localStorage`);
        } else {
            console.log('ℹ️ No Next.js items found in localStorage');
        }
    } catch (e) {
        console.log('⚠️ Could not clear localStorage: ', e);
    }

    // Force reload without cache
    console.log('🔄 Reloading page without cache in 2 seconds...');
    setTimeout(() => {
        window.location.reload(true);
    }, 2000);
})(); 