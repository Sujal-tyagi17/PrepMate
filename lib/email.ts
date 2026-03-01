import { Resend } from 'resend';

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

/**
 * Send an email using Resend
 * @param options Email configuration
 * @returns Promise with success status
 */
export async function sendEmail({ to, subject, html }: EmailOptions) {
    // Email notifications disabled — requires a verified custom domain on Resend.
    // Re-enable by verifying a domain at resend.com/domains and updating RESEND_FROM_EMAIL.
    return { success: false, error: 'Email notifications disabled' };
}

/**
 * Send a bulk email to multiple recipients
 * @param recipients Array of email addresses
 * @param subject Email subject
 * @param html Email HTML content
 * @returns Promise with results
 */
export async function sendBulkEmail(
    recipients: string[],
    subject: string,
    html: string
) {
    const results = await Promise.allSettled(
        recipients.map(to => sendEmail({ to, subject, html }))
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    console.log(`[EMAIL] Bulk send complete: ${successful} successful, ${failed} failed`);

    return {
        total: results.length,
        successful,
        failed,
        results
    };
}
