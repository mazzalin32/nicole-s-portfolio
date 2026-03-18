import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const episodes = await prisma.podcastEpisode.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(episodes);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch episodes" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, audioUrl } = body;

        const episode = await prisma.podcastEpisode.create({
            data: {
                title,
                description,
                audioUrl,
            },
        });

        return NextResponse.json(episode);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create episode" }, { status: 500 });
    }
}
