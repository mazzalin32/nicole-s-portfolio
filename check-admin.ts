import prisma from "./src/lib/prisma";

async function main() {
    const admin = await prisma.admin.findFirst();
    console.log("Current Admin:", admin);
}

main();
