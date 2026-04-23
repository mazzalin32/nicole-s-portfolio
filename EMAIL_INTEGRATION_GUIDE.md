# Technical Documentation: Contact Form Email Integration

This document outlines the strategy and implementation steps used to integrate dynamic email functionality into the portfolio system. This architecture ensures security, flexibility, and ease of management for the end-user.

## 1. Strategy Overview

The system uses a **Serverless API** approach within Next.js to handle email delivery securely without exposing credentials to the client-side.

*   **Backend Engine:** Next.js API Routes (App Router).
*   **Mail Transport:** `Nodemailer` using Gmail's SMTP relay.
*   **Security:** Environment variables (`.env`) and Google **App Passwords** to bypass 2FA while maintaining security.
*   **Dynamic Routing:** The system prioritizes the `contactEmail` stored in the database (`SiteSettings` model), allowing the owner to update the receiver address via the Admin UI without changing code.
*   **Data Integrity:** Input validation is handled via `Zod` to prevent malicious payloads or empty submissions.

## 2. Prerequisites

The following dependencies must be installed:
```bash
npm install nodemailer zod
npm install --save-dev @types/nodemailer
```

## 3. Implementation Steps

### Step 1: Environment Configuration
Define the following variables in the `.env` file. Sensitive data should never be committed to version control.

```env
# Credentials for the sending account
EMAIL_USER="your-sending-email@gmail.com"
EMAIL_PASS="xxxx xxxx xxxx xxxx" # 16-character Google App Password

# Fallback receiver (in case DB lookup fails)
CONTACT_RECEIVER_EMAIL="nicolerwigamba@gmail.com"
```

### Step 2: API Route Design (`src/app/api/contact/route.ts`)
The `POST` endpoint handles the core logic.

1.  **Validation:** Define a schema using Zod for `name`, `email`, `subject`, and `message`.
2.  **Dynamic Receiver Lookup:**
    ```typescript
    const settings = await prisma.siteSettings.findFirst();
    const receiverEmail = settings?.contactEmail || process.env.CONTACT_RECEIVER_EMAIL;
    ```
3.  **Transporter Initialization:**
    ```typescript
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    ```
4.  **Delivery:** Send the email with a `replyTo` header set to the visitor's email, enabling the site owner to reply directly from their inbox.

### Step 3: Database Schema (`prisma/schema.prisma`)
Ensure the `SiteSettings` model supports the contact email field:
```prisma
model SiteSettings {
  id           String  @id @default(cuid())
  contactEmail String
  // ... other fields
}
```

### Step 4: Frontend Integration (`src/components/public/Contact.tsx`)
The contact form sends a `POST` request to `/api/contact` with the form data. It should handle loading states and provide success/error feedback to the user via UI toasts or state messages.

---

## 4. Key Developer Tips

*   **Gmail Limitations:** Gmail has daily sending limits. For high-volume sites, consider switching the `transporter` to a dedicated service like **Resend**, **SendGrid**, or **Postmark**.
*   **HTML Templates:** The API route currently generates a clean HTML template. To customize the "look" of the received email, modify the `html` property in the `mailOptions` object.
*   **Revalidation:** After updating the contact email in the Admin Portal, use `revalidatePath("/")` in the API route to ensure the frontend reflects the most recent settings.
