import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email is required"),
    subject: z.string().optional(),
    message: z.string().min(1, "Message is required"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = contactSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid payload", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { name, email, subject, message } = parsed.data;
        
        // Fetch receiver email from site settings
        const settings = await prisma.siteSettings.findFirst();
        const receiverEmail = settings?.contactEmail || process.env.CONTACT_RECEIVER_EMAIL;
        
        const senderEmail = process.env.EMAIL_USER;
        const senderPass = process.env.EMAIL_PASS;

        if (!senderEmail || !senderPass || !receiverEmail) {
            return NextResponse.json(
                { error: "Email transport is not configured" },
                { status: 500 }
            );
        }

        // Configure Transporter (Gmail)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: senderEmail,
                pass: senderPass,
            },
        });

        // Email Content
        const mailOptions = {
            from: senderEmail,
            to: receiverEmail,
            replyTo: email, // Reply to the visitor
            subject: `New Contact Form Submission: ${subject || "General Inquiry"}`,
            text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
            `,
            html: `
<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Subject:</strong> ${subject}</p>
<hr/>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, "<br>")}</p>
            `,
        };

        // Send Email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact Form Error:", error);
        return NextResponse.json(
            { error: "Failed to send email" },
            { status: 500 }
        );
    }
}
