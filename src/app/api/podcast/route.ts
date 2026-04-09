import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/api-auth";

const createPodcastEpisodeSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    audioUrl: z.string().url("Audio URL must be valid"),
});

export async function GET() {
    try {
        const episodes = await prisma.podcastEpisode.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(episodes);
    } catch {
        return NextResponse.json({ error: "Failed to fetch episodes" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const isAuthenticated = await isAdminAuthenticated();
        if (!isAuthenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const parsed = createPodcastEpisodeSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid payload", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { title, description, audioUrl } = parsed.data;

        const episode = await prisma.podcastEpisode.create({
            data: {
                title,
                description,
                audioUrl,
            },
        });

        return NextResponse.json(episode);
    } catch {
        return NextResponse.json({ error: "Failed to create episode" }, { status: 500 });
    }
}
