import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const { mockIsAdminAuthenticated, mockCreate } = vi.hoisted(() => ({
    mockIsAdminAuthenticated: vi.fn(),
    mockCreate: vi.fn(),
}));

vi.mock("@/lib/api-auth", () => ({
    isAdminAuthenticated: mockIsAdminAuthenticated,
}));

vi.mock("@/lib/prisma", () => ({
    default: {
        blogPost: {
            create: mockCreate,
        },
    },
}));

describe("POST /api/blog", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns 401 when unauthenticated", async () => {
        mockIsAdminAuthenticated.mockResolvedValue(false);

        const req = new Request("http://localhost/api/blog", {
            method: "POST",
            body: JSON.stringify({
                title: "My post",
                content: "Body",
                imageUrl: "",
            }),
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(401);
        expect(data.error).toBe("Unauthorized");
        expect(mockCreate).not.toHaveBeenCalled();
    });

    it("returns 400 for invalid payload", async () => {
        mockIsAdminAuthenticated.mockResolvedValue(true);

        const req = new Request("http://localhost/api/blog", {
            method: "POST",
            body: JSON.stringify({
                title: "",
                content: "Body",
                imageUrl: "not-a-url",
            }),
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toBe("Invalid payload");
        expect(mockCreate).not.toHaveBeenCalled();
    });

    it("creates post for valid authenticated request", async () => {
        mockIsAdminAuthenticated.mockResolvedValue(true);
        mockCreate.mockResolvedValue({
            id: "post-1",
            title: "My post",
            content: "Body",
            imageUrl: null,
        });

        const req = new Request("http://localhost/api/blog", {
            method: "POST",
            body: JSON.stringify({
                title: "My post",
                content: "Body",
                imageUrl: "",
            }),
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(mockCreate).toHaveBeenCalledWith({
            data: {
                title: "My post",
                content: "Body",
                imageUrl: null,
            },
        });
        expect(data.id).toBe("post-1");
    });
});
