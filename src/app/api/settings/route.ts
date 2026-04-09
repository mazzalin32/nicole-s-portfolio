import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/api-auth";

const updateSettingsSchema = z.object({
    id: z.string().min(1, "ID is required"),
    ownerName: z.string().min(1, "Owner name is required"),
    contactEmail: z.string().email("Valid contact email is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    instagramUrl: z.string().url("Valid Instagram URL is required"),
});

export async function GET() {
    try {
        const settings = await prisma.siteSettings.findFirst();
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

        const { id, ownerName, contactEmail, phoneNumber, instagramUrl } = parsed.data;

        const settings = await prisma.siteSettings.update({
            where: { id },
            data: {
                ownerName,
                contactEmail,
                phoneNumber,
                instagramUrl,
            },
        });

        revalidatePath("/");

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
