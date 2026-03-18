import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
    try {
        const about = await prisma.aboutContent.findFirst();
        return NextResponse.json(about);
    } catch (error) {
        console.error("Error fetching about:", error);
        return NextResponse.json({ error: "Failed to fetch about content" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, introLine, headline, description, ctaText } = body;

        const about = await prisma.aboutContent.update({
            where: { id },
            data: {
                introLine,
                headline,
                description,
                ctaText,
            },
        });

        revalidatePath("/");

        return NextResponse.json(about);
    } catch (error) {
        console.error("Error updating about:", error);
        return NextResponse.json({ error: "Failed to update about content" }, { status: 500 });
    }
}
