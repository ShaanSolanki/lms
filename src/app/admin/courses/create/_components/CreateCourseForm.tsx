'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import RichTextEditor from '@/components/rich-text-editor/Editor'
import FileUploader from '@/components/file-uploader/Uploader'
import { CourseLevel, CourseStatus } from '@/lib/types/course'

const createCourseSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    smallDescription: z.string().min(1, 'Small description is required').max(300, 'Small description must be less than 300 characters'),
    description: z.string().min(1, 'Description is required'),
    category: z.string().min(1, 'Category is required'),
    level: z.nativeEnum(CourseLevel),
    duration: z.number().min(1, 'Duration must be at least 1 hour'),
    price: z.number().min(0, 'Price must be 0 or greater'),
    status: z.nativeEnum(CourseStatus),
})

type CreateCourseFormData = z.infer<typeof createCourseSchema>

const categories = [
    'Programming',
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'Design',
    'Business',
    'Marketing',
    'Other'
]

export function CreateCourseForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [thumbnailFiles, setThumbnailFiles] = useState<File[]>([])
    const router = useRouter()

    const form = useForm<CreateCourseFormData>({
        resolver: zodResolver(createCourseSchema),
        defaultValues: {
            title: '',
            slug: '',
            smallDescription: '',
            description: '',
            category: '',
            level: CourseLevel.BEGINNER,
            duration: 1,
            price: 0,
            status: CourseStatus.DRAFT,
        },
    })

    // Auto-generate slug from title
    const handleTitleChange = (title: string) => {
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
        form.setValue('slug', slug)
    }

    const uploadThumbnail = async (file: File): Promise<string> => {
        try {
            console.log('Starting upload for file:', file.name, file.type, file.size);

            // Convert file to base64
            const fileData = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
                    const base64Data = result.split(',')[1];
                    resolve(base64Data);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            // Upload directly to our API
            const response = await fetch('/api/s3/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    fileData: fileData,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                console.error('Upload failed:', errorData)
                throw new Error(`Upload failed: ${errorData.error}`)
            }

            const { key } = await response.json()
            console.log('Upload successful, key:', key)
            return key
        } catch (error) {
            console.error('Upload error:', error)
            throw error
        }
    }

    const onSubmit = async (data: CreateCourseFormData) => {
        if (thumbnailFiles.length === 0) {
            toast.error('Please upload a thumbnail image')
            return
        }

        setIsSubmitting(true)

        try {
            // Upload thumbnail
            const fileKey = await uploadThumbnail(thumbnailFiles[0])

            // Create course
            const courseData = {
                ...data,
                fileKey,
            }

            const response = await fetch('/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(courseData),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to create course')
            }

            const course = await response.json()
            toast.success('Course created successfully!')
            router.push(`/admin/courses/${course._id}`)
        } catch (error) {
            console.error('Error creating course:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to create course')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Course Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter course title"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    handleTitleChange(e.target.value)
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Course Slug</FormLabel>
                                        <FormControl>
                                            <Input placeholder="course-slug" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            URL-friendly version of the title. Only lowercase letters, numbers, and hyphens.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="smallDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Small Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Brief description for course cards"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Short description shown on course cards (max 300 characters)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Course Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="level"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Difficulty Level</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select difficulty level" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={CourseLevel.BEGINNER}>Beginner</SelectItem>
                                                <SelectItem value={CourseLevel.INTERMEDIATE}>Intermediate</SelectItem>
                                                <SelectItem value={CourseLevel.ADVANCED}>Advanced</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duration (hours)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    placeholder="10"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price ($)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="99.99"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={CourseStatus.DRAFT}>Draft</SelectItem>
                                                <SelectItem value={CourseStatus.PUBLISHED}>Published</SelectItem>
                                                <SelectItem value={CourseStatus.ARCHIVED}>Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Description */}
                <Card>
                    <CardHeader>
                        <CardTitle>Course Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Detailed Description</FormLabel>
                                    <FormControl>
                                        <RichTextEditor
                                            content={field.value}
                                            onChange={field.onChange}
                                            placeholder="Write a detailed description of your course..."
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Provide a comprehensive description of what students will learn
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {/* Thumbnail Upload */}
                <Card>
                    <CardHeader>
                        <CardTitle>Course Thumbnail</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <Label>Thumbnail Image</Label>
                            <div className="mt-2">
                                <FileUploader
                                    onFilesChange={setThumbnailFiles}
                                    maxFiles={1}
                                    maxSize={5 * 1024 * 1024} // 5MB
                                    acceptedFileTypes={['image/*']}
                                    multiple={false}
                                />
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                Upload a high-quality image that represents your course (max 5MB)
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating Course...' : 'Create Course'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}