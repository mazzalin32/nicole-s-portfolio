import prisma from "./src/lib/prisma";

async function main() {
    const settings = await prisma.siteSettings.findFirst();
    if (settings) {
        await prisma.siteSettings.update({
            where: { id: settings.id },
            data: { contactEmail: "nicolerwigamba@gmail.com" }
        });
        console.log("Updated contact email to: nicolerwigamba@gmail.com");
    }
}

main();
