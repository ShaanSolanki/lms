'use client'

import { useState } from 'react'
import { getS3ObjectUrl, getDirectS3ObjectUrl } from '@/lib/utils/s3'

interface CourseThumbnailProps {
    fileKey: string
    title: string
    className?: string
}

export function CourseThumbnail({ fileKey, title, className = '' }: CourseThumbnailProps) {
    const [imageError, setImageError] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)

    const handleImageError = () => {
        setImageError(true)
        setImageLoading(false)
    }

    const handleImageLoad = () => {
        setImageLoading(false)
    }

    if (!fileKey) {
        return (
            <div className={`aspect-video bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
                <p className="text-sm text-muted-foreground">No thumbnail uploaded</p>
            </div>
        )
    }

    if (imageError) {
        const imageUrl = getS3ObjectUrl(fileKey)
        return (
            <div className={`aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center ${className}`}>
                <p className="text-sm text-muted-foreground">Failed to load image</p>
                <p className="text-xs text-gray-400 mt-1 text-center px-2">{fileKey}</p>
                <p className="text-xs text-blue-500 mt-1 text-center px-2 break-all">URL: {imageUrl}</p>
                <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 underline mt-1"
                >
                    Test URL
                </a>
            </div>
        )
    }

    return (
        <div className={`aspect-video bg-gray-100 rounded-lg overflow-hidden relative ${className}`}>
            {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}
            <img
                src={getS3ObjectUrl(fileKey)}
                alt={title}
                className="w-full h-full object-cover"
                onError={handleImageError}
                onLoad={handleImageLoad}
            />
        </div>
    )
}