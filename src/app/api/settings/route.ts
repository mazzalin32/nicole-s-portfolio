import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/api-auth";

const updateSettingsSchema = z.object({
    id: z.string().min(1, "ID is required"),
    ownerName: z.string().min(1, "Owner name is required"),
    contactEmail: z.string().email("Valid contact email is required"),
    phoneNumber: z.string().optional().nullable(),
    instagramUrl: z.string().optional().nullable(),
    socialLinks: z.array(z.object({
        platform: z.string(),
        url: z.string(),
        iconName: z.string().optional().nullable(),
    })).optional(),
});

export async function GET() {
    try {
        const settings = await prisma.siteSettings.findFirst({
            include: { socialLinks: { orderBy: { order: 'asc' } } }
        });
        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const isAuthenticated = await isAdminAuthenticated();
        if (!isAuthenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const parsed = updateSettingsSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid payload", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { id, ownerName, contactEmail, phoneNumber, instagramUrl, socialLinks } = parsed.data;

        // Transaction to update settings and sync social links
        const settings = await prisma.$transaction(async (tx) => {
            if (socialLinks) {
                // Delete existing ones
                await tx.socialLink.deleteMany({
                    where: { siteSettingsId: id }
                });

                // Create new ones
                if (socialLinks.length > 0) {
                    await tx.socialLink.createMany({
                        data: socialLinks.map((link, index) => ({
                            ...link,
                            siteSettingsId: id,
                            order: index
                        }))
                    });
                }
            }

            return await tx.siteSettings.update({
                where: { id },
                data: {
                    ownerName,
                    contactEmail,
                    phoneNumber,
                    instagramUrl,
                },
                include: { socialLinks: true }
            });
        });

        revalidatePath("/");

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
