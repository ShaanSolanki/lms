import mongoose, { Document, Schema } from "mongoose";
import { CourseLevel, CourseStatus, ICourse as ICourseBase } from "@/lib/types/course";

export enum ProjectSubmissionStatus {
    IN_REVIEW = "in_review",
    PASS = "pass",
    FAIL = "fail"
}

// Interface for MCQ Test
export interface IMCQTest {
    _id?: string;
    title: string;
    questions: Array<{
        question: string;
        options: string[];
        correctAnswer: number; // Index of correct option
        explanation?: string;
    }>;
    passingScore: number; // Percentage required to pass
    timeLimit?: number; // Time limit in minutes
    order: number; // Order in the course
}

// Interface for Course document (extends the base interface with Mongoose Document)
export interface ICourse extends Document, ICourseBase {
    tests: IMCQTest[]; // MCQ-based tests throughout the course
    finalProject?: {
        title: string;
        description: string;
        requirements: string[];
        submissionInstructions: string;
    };
}

// MCQ Test schema
const mcqTestSchema = new Schema<IMCQTest>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    questions: [{
        question: {
            type: String,
            required: true,
        },
        options: [{
            type: String,
            required: true,
        }],
        correctAnswer: {
            type: Number,
            required: true,
            min: 0,
        },
        explanation: {
            type: String,
            trim: true,
        },
    }],
    passingScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    timeLimit: {
        type: Number,
        min: 1, // At least 1 minute
    },
    order: {
        type: Number,
        required: true,
        min: 1,
    },
});

// Course schema
const courseSchema = new Schema<ICourse>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        smallDescription: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300,
        },
        fileKey: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        duration: {
            type: Number,
            required: true,
            min: 1, // At least 1 hour
        },
        level: {
            type: String,
            enum: Object.values(CourseLevel),
            required: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        status: {
            type: String,
            enum: Object.values(CourseStatus),
            default: CourseStatus.DRAFT,
        },
        tests: [mcqTestSchema],
        finalProject: {
            title: {
                type: String,
                trim: true,
            },
            description: {
                type: String,
                trim: true,
            },
            requirements: [{
                type: String,
                trim: true,
            }],
            submissionInstructions: {
                type: String,
                trim: true,
            },
        },
    },
    {
        timestamps: true,
        collection: "courses",
    }
);

// Export the model without indexes (indexes will be created server-side only)
export const Course = mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);

// Server-only function to ensure indexes are created
export async function ensureCourseIndexes() {
    if (typeof window !== 'undefined') {
        // Don't run on client side
        return;
    }

    try {
        // Create indexes only on server side
        await Course.collection.createIndex({ slug: 1 }, { unique: true });
        await Course.collection.createIndex({ category: 1 });
        await Course.collection.createIndex({ level: 1 });
        await Course.collection.createIndex({ status: 1 });
        await Course.collection.createIndex({ price: 1 });
        await Course.collection.createIndex({ createdAt: -1 });
        console.log('Course indexes created successfully');
    } catch (error) {
        // Indexes might already exist, which is fine
        console.log('Course indexes already exist or error creating them:', error);
    }
}