import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/api-auth";

const skillSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1),
    description: z.string().optional().nullable(),
    level: z.number().default(0),
    category: z.string(),
    order: z.number().default(0),
});

const platformSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1),
    order: z.number().default(0),
});

export async function GET() {
    try {
        const [skills, platforms] = await Promise.all([
            prisma.skill.findMany({ orderBy: { order: "asc" } }),
            prisma.platform.findMany({ orderBy: { order: "asc" } }),
        ]);
        return NextResponse.json({ skills, platforms });
    } catch (error) {
        console.error("Error fetching skills/platforms:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const isAuthenticated = await isAdminAuthenticated();
        if (!isAuthenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { type, data } = body;

        if (type === "skill") {
            const parsed = skillSchema.safeParse(data);
            if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
            const skill = await prisma.skill.create({ data: parsed.data });
            revalidatePath("/");
            return NextResponse.json(skill);
        } else if (type === "platform") {
            const parsed = platformSchema.safeParse(data);
            if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
            const platform = await prisma.platform.create({ data: parsed.data });
            revalidatePath("/");
            return NextResponse.json(platform);
        }

        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const isAuthenticated = await isAdminAuthenticated();
        if (!isAuthenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { type, data } = body;

        if (type === "skill") {
            const parsed = skillSchema.safeParse(data);
            if (!parsed.success || !data.id) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
            const skill = await prisma.skill.update({ where: { id: data.id }, data: parsed.data });
            revalidatePath("/");
            return NextResponse.json(skill);
        } else if (type === "platform") {
            const parsed = platformSchema.safeParse(data);
            if (!parsed.success || !data.id) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
            const platform = await prisma.platform.update({ where: { id: data.id }, data: parsed.data });
            revalidatePath("/");
            return NextResponse.json(platform);
        }

        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const isAuthenticated = await isAdminAuthenticated();
        if (!isAuthenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const type = searchParams.get("type");

        if (!id || !type) return NextResponse.json({ error: "ID and type are required" }, { status: 400 });

        if (type === "skill") {
            await prisma.skill.delete({ where: { id } });
        } else if (type === "platform") {
            await prisma.platform.delete({ where: { id } });
        } else {
            return NextResponse.json({ error: "Invalid type" }, { status: 400 });
        }

        revalidatePath("/");
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
