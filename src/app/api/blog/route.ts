import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/api-auth";

const createBlogPostSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    imageUrl: z.string().url("Image URL must be valid").optional().or(z.literal("")),
});

export async function GET() {
    try {
        const posts = await prisma.blogPost.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(posts);
    } catch {
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const isAuthenticated = await isAdminAuthenticated();
        if (!isAuthenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const parsed = createBlogPostSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid payload", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { title, content, imageUrl } = parsed.data;

        const post = await prisma.blogPost.create({
            data: {
                title,
                content,
                imageUrl: imageUrl || null,
            },
        });

        return NextResponse.json(post);
    } catch {
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
