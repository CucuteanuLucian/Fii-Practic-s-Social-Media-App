import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/db';

export async function GET() {
    try {
        const posts = await db.post.findMany({});
        const postsWithComments = await Promise.all(
            posts.map(async (post) => {
                const comments = await db.comment.findMany({
                    where: {
                        postId: post.id
                    }
                });
                return {
                    ...post,
                    comments
                };
            })
        );
        return NextResponse.json(postsWithComments);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const post = await db.post.create({
            data: {
                content: body.content,
                created_at: new Date(),
                likes: 0
            }
        });
        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
