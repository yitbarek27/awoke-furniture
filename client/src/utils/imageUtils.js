export const getImageUrl = (url) => {
    if (!url) return '/images/hero.png';

    let resolvedUrl = url;

    // If it's a full URL (starting with http), return as is
    if (url.startsWith('http')) {
        return url;
    }

    // Replace backslashes with forward slashes for Windows compatibility
    url = url.replace(/\\/g, '/');

    // Ensure it's a root-relative path (starts with /)
    const normalizedUrl = url.startsWith('/') ? url : `/${url}`;

    // Special handling for /uploads
    if (normalizedUrl.startsWith('/uploads')) {
        return normalizedUrl;
    }

    return normalizedUrl;

    // Debugging (remove in production)
    // console.log(`Resolving image: ${url} -> ${resolvedUrl}`);

    return resolvedUrl;
};
