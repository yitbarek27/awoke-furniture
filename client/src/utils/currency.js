export const formatETB = (value) => {
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return 'ETB 0';
    }

    try {
        // Prefer a locale that commonly exists in browsers; currency controls the symbol.
        return new Intl.NumberFormat('en-ET', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        // Fallback for very old environments
        return `ETB ${amount.toFixed(2)}`;
    }
};
