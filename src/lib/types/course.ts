// Course types that can be safely imported on both client and server
export enum CourseLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced',
}

export enum CourseStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
}

export interface ICourse {
    _id?: string
    title: string
    slug: string
    smallDescription: string
    description: string
    category: string
    level: CourseLevel
    duration: number
    price: number
    status: CourseStatus
    fileKey?: string
    thumbnailUrl?: string
    createdAt?: Date
    updatedAt?: Date
}