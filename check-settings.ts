import prisma from "./src/lib/prisma";

async function main() {
    const settings = await prisma.siteSettings.findFirst();
    console.log("Current Settings:", settings);
}

main();
