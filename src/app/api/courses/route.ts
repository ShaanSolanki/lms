import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Course, ensureCourseIndexes } from '@/lib/models/course'
import { CourseLevel, CourseStatus } from '@/lib/types/course'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { connectDB } from '@/lib/db'
import { requireAdminAPI } from '@/app/data/admin/require-admin-api'

const createCourseSchema = z.object({
    title: z.string().min(1).max(200),
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
    smallDescription: z.string().min(1).max(300),
    description: z.string().min(1),
    category: z.string().min(1),
    level: z.nativeEnum(CourseLevel),
    duration: z.number().min(1),
    price: z.number().min(0),
    status: z.nativeEnum(CourseStatus),
    fileKey: z.string().min(1),
})

export async function POST(request: NextRequest) {
    try {
        // Check admin authentication
        const sessionOrError = await requireAdminAPI()
        if (sessionOrError instanceof NextResponse) {
            return sessionOrError
        }

        // Parse request body
        const body = await request.json()
        const validation = createCourseSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid data', details: validation.error.issues },
                { status: 400 }
            )
        }

        const data = validation.data

        // Connect to database and ensure indexes
        await connectDB()
        await ensureCourseIndexes()

        // Check if slug already exists
        const existingCourse = await Course.findOne({ slug: data.slug })
        if (existingCourse) {
            return NextResponse.json(
                { error: 'A course with this slug already exists' },
                { status: 409 }
            )
        }

        // Create course
        const course = new Course(data)
        await course.save()

        return NextResponse.json(course, { status: 201 })
    } catch (error) {
        console.error('Error creating course:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const category = searchParams.get('category')
        const level = searchParams.get('level')
        const status = searchParams.get('status')

        await connectDB()
        await ensureCourseIndexes()

        // Build filter
        const filter: Record<string, string> = {}
        if (category) filter.category = category
        if (level) filter.level = level
        if (status) filter.status = status

        // Get courses with pagination
        const skip = (page - 1) * limit
        const courses = await Course.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        const total = await Course.countDocuments(filter)

        return NextResponse.json({
            courses,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('Error fetching courses:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}