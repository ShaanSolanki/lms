/**
 * Format price in Indian Rupees (Rs)
 * @param price - The price amount
 * @returns Formatted price string
 */
export function formatPrice(price: number): string {
    if (price === 0) {
        return 'Free';
    }

    // Format with Indian number system (lakhs, crores)
    return `₹${price.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
}

/**
 * Format price for display in forms (without currency symbol)
 * @param price - The price amount
 * @returns Formatted price string without currency symbol
 */
export function formatPriceInput(price: number): string {
    return price.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}