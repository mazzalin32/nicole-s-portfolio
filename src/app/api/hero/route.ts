import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
    try {
        const hero = await prisma.heroContent.findFirst();
        return NextResponse.json(hero);
    } catch (error) {
        console.error("Error fetching hero:", error);
        return NextResponse.json({ error: "Failed to fetch hero content" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, headline, subtitle, ctaText, studentsCount, roleTitle, roleSubtitle } = body;

        const hero = await prisma.heroContent.update({
            where: { id },
            data: {
                headline,
                subtitle,
                ctaText,
                studentsCount,
                roleTitle,
                roleSubtitle,
            },
        });

        revalidatePath("/");

        return NextResponse.json(hero);
    } catch (error) {
        console.error("Error updating hero:", error);
        return NextResponse.json({ error: "Failed to update hero content" }, { status: 500 });
    }
}
