import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/api-auth";

const serviceSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    iconName: z.string().optional(),
    order: z.number().default(0),
    features: z.array(z.string()).optional(),
});

export async function GET() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { order: "asc" },
            include: { features: true },
        });
        return NextResponse.json(services);
    } catch (error) {
        console.error("Error fetching services:", error);
        return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const isAuthenticated = await isAdminAuthenticated();
        if (!isAuthenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const parsed = serviceSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });

        const { title, description, iconName, order, features } = parsed.data;

        const service = await prisma.service.create({
            data: {
                title,
                description,
                iconName,
                order,
                features: {
                    create: features?.map((text) => ({ text })) || [],
                },
            },
        });

        revalidatePath("/");
        return NextResponse.json(service);
    } catch (error) {
        console.error("Error creating service:", error);
        return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const isAuthenticated = await isAdminAuthenticated();
        if (!isAuthenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const parsed = serviceSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });

        const { id, title, description, iconName, order, features } = parsed.data;
        if (!id) return NextResponse.json({ error: "ID is required for update" }, { status: 400 });

        // Update service and its features
        const service = await prisma.$transaction(async (tx) => {
            // Delete existing features
            await tx.serviceFeature.deleteMany({ where: { serviceId: id } });

            // Update service and create new features
            return await tx.service.update({
                where: { id },
                data: {
                    title,
                    description,
                    iconName,
                    order,
                    features: {
                        create: features?.map((text) => ({ text })) || [],
                    },
                },
            });
        });

        revalidatePath("/");
        return NextResponse.json(service);
    } catch (error) {
        console.error("Error updating service:", error);
        return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const isAuthenticated = await isAdminAuthenticated();
        if (!isAuthenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        await prisma.service.delete({ where: { id } });

        revalidatePath("/");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting service:", error);
        return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
    }
}
