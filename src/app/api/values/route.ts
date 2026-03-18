import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
        const body = await request.json();
        const { title, description, order } = body;

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
        const body = await request.json();
        const { id, title, description, order } = body;

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
