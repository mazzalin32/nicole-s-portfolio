import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUT } from "./route";

const { mockIsAdminAuthenticated, mockUpdate, mockRevalidatePath } = vi.hoisted(() => ({
    mockIsAdminAuthenticated: vi.fn(),
    mockUpdate: vi.fn(),
    mockRevalidatePath: vi.fn(),
}));

vi.mock("@/lib/api-auth", () => ({
    isAdminAuthenticated: mockIsAdminAuthenticated,
}));

vi.mock("next/cache", () => ({
    revalidatePath: mockRevalidatePath,
}));

vi.mock("@/lib/prisma", () => ({
    default: {
        heroContent: {
            update: mockUpdate,
        },
    },
}));

describe("PUT /api/hero", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns 401 when unauthenticated", async () => {
        mockIsAdminAuthenticated.mockResolvedValue(false);

        const req = new Request("http://localhost/api/hero", {
            method: "PUT",
            body: JSON.stringify({}),
        });

        const res = await PUT(req);
        const data = await res.json();

        expect(res.status).toBe(401);
        expect(data.error).toBe("Unauthorized");
        expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("returns 400 for invalid payload", async () => {
        mockIsAdminAuthenticated.mockResolvedValue(true);

        const req = new Request("http://localhost/api/hero", {
            method: "PUT",
            body: JSON.stringify({
                id: "",
                headline: "",
                subtitle: "",
                ctaText: "",
                studentsCount: "",
                roleTitle: "",
                roleSubtitle: "",
            }),
        });

        const res = await PUT(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toBe("Invalid payload");
        expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("updates hero content for valid authenticated request", async () => {
        mockIsAdminAuthenticated.mockResolvedValue(true);
        mockUpdate.mockResolvedValue({
            id: "hero-1",
            headline: "Hello",
            subtitle: "Subtitle",
            ctaText: "Work With Me",
            studentsCount: "500K+",
            roleTitle: "Creator",
            roleSubtitle: "Lifestyle",
        });

        const req = new Request("http://localhost/api/hero", {
            method: "PUT",
            body: JSON.stringify({
                id: "hero-1",
                headline: "Hello",
                subtitle: "Subtitle",
                ctaText: "Work With Me",
                studentsCount: "500K+",
                roleTitle: "Creator",
                roleSubtitle: "Lifestyle",
            }),
        });

        const res = await PUT(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(mockUpdate).toHaveBeenCalledWith({
            where: { id: "hero-1" },
            data: {
                headline: "Hello",
                subtitle: "Subtitle",
                ctaText: "Work With Me",
                studentsCount: "500K+",
                roleTitle: "Creator",
                roleSubtitle: "Lifestyle",
            },
        });
        expect(mockRevalidatePath).toHaveBeenCalledWith("/");
        expect(data.id).toBe("hero-1");
    });
});
