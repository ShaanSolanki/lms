import { z } from "zod";
import { PutObjectCommand, CreateBucketCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import { S3 } from "@/lib/S3Client";
import { NextResponse } from "next/server";

// Generate a simple unique ID without external dependencies
function generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Schema for direct file upload
const fileUploadSchema = z.object({
    fileName: z.string().min(1, { message: "File name is required" }),
    contentType: z.string().min(1, { message: "Content type is required" }),
    fileData: z.string().min(1, { message: "File data is required" }), // Base64 encoded file
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Upload request received for file:', body.fileName);

        const validation = fileUploadSchema.safeParse(body);

        if (!validation.success) {
            console.error('Validation error:', validation.error);
            return NextResponse.json({
                error: "Invalid data",
                details: validation.error.issues
            }, { status: 400 });
        }

        const { fileName, contentType, fileData } = validation.data;
        const uniqueKey = `${generateUniqueId()}-${fileName}`;

        console.log('Uploading to S3:', {
            bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            key: uniqueKey,
            contentType,
            endpoint: process.env.AWS_ENDPOINT_URL_S3,
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID?.substring(0, 10) + '...' // Only show first 10 chars for security
        });

        // Check if bucket exists, create if it doesn't
        const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES!;

        try {
            await S3.send(new HeadBucketCommand({ Bucket: bucketName }));
            console.log('Bucket exists:', bucketName);
        } catch (error: any) {
            if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
                console.log('Bucket does not exist, creating:', bucketName);
                try {
                    await S3.send(new CreateBucketCommand({ Bucket: bucketName }));
                    console.log('Bucket created successfully:', bucketName);
                } catch (createError) {
                    console.error('Failed to create bucket:', createError);
                    throw new Error(`Failed to create bucket: ${createError}`);
                }
            } else {
                console.error('Error checking bucket:', error);
                throw new Error(`Error accessing bucket: ${error.message}`);
            }
        }

        // Convert base64 to buffer
        const buffer = Buffer.from(fileData, 'base64');

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: uniqueKey,
            Body: buffer,
            ContentType: contentType,
            ContentLength: buffer.length,
        });

        await S3.send(command);

        console.log('Upload successful, key:', uniqueKey);

        const response = NextResponse.json({
            success: true,
            key: uniqueKey,
            url: `${process.env.AWS_ENDPOINT_URL_S3}/${process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}/${uniqueKey}`
        });

        // Add CORS headers
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

        return response;

    } catch (error: any) {
        console.error('S3 upload error:', error);

        // Provide more specific error information
        let errorMessage = 'Unknown error';
        let statusCode = 500;

        if (error.name === 'AccessDenied') {
            errorMessage = 'Access denied to S3 bucket. Check your credentials and bucket permissions.';
            statusCode = 403;
        } else if (error.name === 'NoSuchBucket') {
            errorMessage = 'Bucket does not exist. Please create the bucket first.';
            statusCode = 404;
        } else if (error.message) {
            errorMessage = error.message;
        }

        return NextResponse.json({
            error: "S3 Upload Failed",
            details: errorMessage,
            errorCode: error.name || 'Unknown',
            bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES
        }, { status: statusCode });
    }
}

export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}