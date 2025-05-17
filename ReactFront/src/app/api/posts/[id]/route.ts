import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/db';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const post = await db.post.findFirst({
            where: {
                id
            }
        });

        if (!post) {
            return NextResponse.json({ error: `Post with id: ${id} not found` }, { status: 500 });
        }

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const data = await request.json();
        const { id } = await params;
        const post = await db.post.update({
            where: {
                id
            },
            data
        });

        if (!post) {
            return NextResponse.json({ error: `Post with id: ${id} not found` }, { status: 500 });
        }

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;

        const post = await db.post.findFirst({
            where: {
                id
            }
        });

        if (!post) {
            return NextResponse.json({ error: `Post with id: ${id} not found` }, { status: 500 });
        }

        await db.post.delete({
            where: {
                id
            }
        });

        return NextResponse.json(
            { success: true, message: `Post with id: ${id} deleted successfully` },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
