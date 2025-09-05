import { GetObjectCommand } from "@aws-sdk/client-s3";
import { S3 } from "@/lib/S3Client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ key: string }> }
) {
    try {
        const { key } = await params;
        const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES!;

        console.log('Serving image:', { bucket: bucketName, key });

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        const response = await S3.send(command);

        if (!response.Body) {
            return new NextResponse('File not found', { status: 404 });
        }

        // Convert the stream to a buffer
        const chunks: Uint8Array[] = [];
        const reader = response.Body.transformToWebStream().getReader();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
        }

        const buffer = Buffer.concat(chunks);

        // Return the image with proper headers
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': response.ContentType || 'image/jpeg',
                'Content-Length': response.ContentLength?.toString() || buffer.length.toString(),
                'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
            },
        });

    } catch (error: any) {
        console.error('Error serving image:', error);

        if (error.name === 'NoSuchKey') {
            return new NextResponse('File not found', { status: 404 });
        }

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}