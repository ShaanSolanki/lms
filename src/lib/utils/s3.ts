/**
 * Generate the public URL for an S3 object
 */
export function getS3ObjectUrl(key: string): string {
    const endpoint = process.env.NEXT_PUBLIC_AWS_ENDPOINT_URL_S3;
    const bucket = process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES;

    if (!endpoint || !bucket) {
        console.error('Missing S3 configuration for public URLs', { endpoint, bucket });
        return '';
    }

    // Use our own API to serve images, bypassing any CORS or public access issues
    const baseUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/s3/serve/${encodeURIComponent(key)}`;

    console.log('Generated S3 URL (via API):', url);
    return url;
}

/**
 * Generate the direct Tigris URL for an S3 object (for testing)
 */
export function getDirectS3ObjectUrl(key: string): string {
    const endpoint = process.env.NEXT_PUBLIC_AWS_ENDPOINT_URL_S3;
    const bucket = process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES;

    if (!endpoint || !bucket) {
        return '';
    }

    // Try different URL formats for Tigris
    const standardUrl = `${endpoint}/${bucket}/${key}`;
    const tigrisUrl = `https://${bucket}.t3.storage.dev/${key}`;

    return standardUrl;
}

/**
 * Check if a file key represents an image
 */
export function isImageFile(key: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const lowerKey = key.toLowerCase();
    return imageExtensions.some(ext => lowerKey.endsWith(ext));
}