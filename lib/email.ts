import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    try {
        // Validate environment variables
        if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('re_placeholder')) {
            console.error('[EMAIL] Resend API key not configured');
            return { success: false, error: 'Email service not configured' };
        }

        if (!process.env.RESEND_FROM_EMAIL) {
            console.error('[EMAIL] FROM email not configured');
            return { success: false, error: 'FROM email not configured' };
        }

        console.log('[EMAIL] Sending email to:', to, 'Subject:', subject);

        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to,
            subject,
            html,
        });

        if (error) {
            console.error('[EMAIL] Resend API error:', error);
            return { success: false, error: error.message };
        }

        console.log('[EMAIL] Email sent successfully:', data?.id);
        return { success: true, data };
    } catch (error) {
        console.error('[EMAIL] Failed to send email:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
        };
    }
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
