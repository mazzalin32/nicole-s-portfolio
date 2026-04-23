const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.admin.findFirst();
    if (admin) {
        await prisma.admin.update({
            where: { id: admin.id },
            data: { 
                email: "nicolerwigamba@gmail.com",
                name: "Nicole"
            }
        });
        console.log("Admin email updated to: nicolerwigamba@gmail.com");
    } else {
        console.log("No admin found to update.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
