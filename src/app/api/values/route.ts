import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/api-auth";

const createValueSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    order: z.number().int().nonnegative("Order must be zero or greater"),
});

const updateValueSchema = createValueSchema.extend({
    id: z.string().min(1, "ID is required"),
});

export async function GET() {
    try {
        const values = await prisma.value.findMany({
            orderBy: { order: "asc" },
        });
        return NextResponse.json(values);
    } catch (error) {
        console.error("Error fetching values:", error);
        return NextResponse.json({ error: "Failed to fetch values" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const isAuthenticated = await isAdminAuthenticated();
        if (!isAuthenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const parsed = createValueSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid payload", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { title, description, order } = parsed.data;

        const value = await prisma.value.create({
            data: { title, description, order },
        });

        revalidatePath("/");

        return NextResponse.json(value);
    } catch (error) {
        console.error("Error creating value:", error);
        return NextResponse.json({ error: "Failed to create value" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const isAuthenticated = await isAdminAuthenticated();
        if (!isAuthenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const parsed = updateValueSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid payload", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { id, title, description, order } = parsed.data;

        const value = await prisma.value.update({
            where: { id },
            data: { title, description, order },
        });

        revalidatePath("/");

        return NextResponse.json(value);
    } catch (error) {
        console.error("Error updating value:", error);
        return NextResponse.json({ error: "Failed to update value" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const isAuthenticated = await isAdminAuthenticated();
        if (!isAuthenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await prisma.value.delete({
            where: { id },
        });

        revalidatePath("/");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting value:", error);
        return NextResponse.json({ error: "Failed to delete value" }, { status: 500 });
    }
}
