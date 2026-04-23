import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/api-auth";

const updateHeroSchema = z.object({
    id: z.string().min(1, "ID is required"),
    headline: z.string().min(1, "Headline is required"),
    subtitle: z.string().min(1, "Subtitle is required"),
    ctaText: z.string().min(1, "CTA text is required"),
    imageUrl: z.string().optional(),
    studentsCount: z.string().min(1, "Students count is required"),
    roleTitle: z.string().min(1, "Role title is required"),
    roleSubtitle: z.string().min(1, "Role subtitle is required"),
});

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
        const isAuthenticated = await isAdminAuthenticated();
        if (!isAuthenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const parsed = updateHeroSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid payload", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { id, headline, subtitle, ctaText, imageUrl, studentsCount, roleTitle, roleSubtitle } = parsed.data;

        const hero = await prisma.heroContent.update({
            where: { id },
            data: {
                headline,
                subtitle,
                ctaText,
                imageUrl,
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
