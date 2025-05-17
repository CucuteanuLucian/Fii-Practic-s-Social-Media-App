import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/db';

export async function GET() {
    try {
        const comments = await db.comment.findMany({});

        return NextResponse.json(comments);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const post = await db.post.findFirst({
            where: {
                id: body.postId
            }
        });

        if (!post) {
            return NextResponse.json({ error: `Post with id: ${body.postId} not found` }, { status: 500 });
        }

        const comment = await db.comment.create({
            data: {
                content: body.content,
                created_at: new Date(),
                postId: body.postId
            }
        });
        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }
}
