import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="container mx-auto py-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
            <p className="text-muted-foreground mb-8">
                The course you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/admin/courses">
                <Button>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Courses
                </Button>
            </Link>
        </div>
    )
}