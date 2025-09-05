'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, File, Image, FileText, Video } from 'lucide-react'

interface FileWithPreview extends File {
    preview?: string
}

interface FileUploaderProps {
    onFilesChange?: (files: File[]) => void
    maxFiles?: number
    maxSize?: number // in bytes
    acceptedFileTypes?: string[]
    multiple?: boolean
    disabled?: boolean
    className?: string
}

const FileUploader = ({
    onFilesChange,
    maxFiles = 10,
    maxSize = 10 * 1024 * 1024, // 10MB default
    acceptedFileTypes = ['image/*', 'application/pdf', 'text/*', 'video/*'],
    multiple = true,
    disabled = false,
    className = ''
}: FileUploaderProps) => {
    const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([])
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map(file => {
            const fileWithPreview = Object.assign(file, {
                preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
            })
            return fileWithPreview
        })

        const updatedFiles = multiple
            ? [...uploadedFiles, ...newFiles].slice(0, maxFiles)
            : newFiles.slice(0, 1)

        setUploadedFiles(updatedFiles)
        onFilesChange?.(updatedFiles)

        // Simulate upload progress
        newFiles.forEach(file => {
            simulateUploadProgress(file.name)
        })
    }, [uploadedFiles, multiple, maxFiles, onFilesChange])

    const simulateUploadProgress = (fileName: string) => {
        let progress = 0
        const interval = setInterval(() => {
            progress += Math.random() * 30
            if (progress >= 100) {
                progress = 100
                clearInterval(interval)
                setUploadProgress(prev => {
                    const { [fileName]: _, ...rest } = prev
                    return rest
                })
            }
            setUploadProgress(prev => ({ ...prev, [fileName]: progress }))
        }, 200)
    }

    const removeFile = (fileToRemove: FileWithPreview) => {
        const updatedFiles = uploadedFiles.filter(file => file !== fileToRemove)
        setUploadedFiles(updatedFiles)
        onFilesChange?.(updatedFiles)

        // Clean up preview URL
        if (fileToRemove.preview) {
            URL.revokeObjectURL(fileToRemove.preview)
        }
    }

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return <Image size={20} />
        if (file.type.startsWith('video/')) return <Video size={20} />
        if (file.type === 'application/pdf' || file.type.startsWith('text/')) return <FileText size={20} />
        return <File size={20} />
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: acceptedFileTypes.reduce((acc, type) => {
            acc[type] = []
            return acc
        }, {} as Record<string, string[]>),
        maxSize,
        maxFiles: multiple ? maxFiles : 1,
        multiple,
        disabled
    })

    return (
        <div className={`w-full ${className}`}>
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive && !isDragReject ? 'border-blue-400 bg-blue-50' : ''}
          ${isDragReject ? 'border-red-400 bg-red-50' : ''}
          ${!isDragActive && !isDragReject ? 'border-gray-300 hover:border-gray-400' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                <input {...getInputProps()} />
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />

                {isDragActive ? (
                    isDragReject ? (
                        <p className="text-red-600">Some files are not supported</p>
                    ) : (
                        <p className="text-blue-600">Drop the files here...</p>
                    )
                ) : (
                    <div>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                            Drag & drop files here, or click to select
                        </p>
                        <p className="text-sm text-gray-500">
                            Supports: {acceptedFileTypes.join(', ')} • Max size: {formatFileSize(maxSize)}
                            {multiple && ` • Max files: ${maxFiles}`}
                        </p>
                    </div>
                )}
            </div>

            {/* File List */}
            {uploadedFiles.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Uploaded Files ({uploadedFiles.length})
                    </h3>
                    <div className="space-y-3">
                        {uploadedFiles.map((file, index) => (
                            <div
                                key={`${file.name}-${index}`}
                                className="flex items-center p-4 bg-gray-50 rounded-lg border"
                            >
                                {/* File Preview/Icon */}
                                <div className="flex-shrink-0 mr-4">
                                    {file.preview ? (
                                        <img
                                            src={file.preview}
                                            alt={file.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                            {getFileIcon(file)}
                                        </div>
                                    )}
                                </div>

                                {/* File Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatFileSize(file.size)}
                                    </p>

                                    {/* Progress Bar */}
                                    {uploadProgress[file.name] !== undefined && (
                                        <div className="mt-2">
                                            <div className="bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress[file.name]}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Uploading... {Math.round(uploadProgress[file.name])}%
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFile(file)}
                                    className="flex-shrink-0 ml-4 p-2 text-gray-400 hover:text-red-600 transition-colors"
                                    title="Remove file"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default FileUploader