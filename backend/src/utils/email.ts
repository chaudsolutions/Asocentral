import nodemailer from "nodemailer";
import AppSettingsModel from "../models/app-settings.model";

const buildNotificationTemplate = (params: {
    appName: string;
    heading: string;
    body: string;
    ctaLabel?: string;
    ctaLink?: string;
}) => {
    const {
        appName,
        heading,
        body,
        ctaLabel = "Open Dashboard",
        ctaLink = "N/A",
    } = params;

    return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6fb;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="background:#ffffff;border:1px solid #e6e8ef;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="background:#003366;color:#ffffff;padding:16px 24px;">
                <table role="presentation" width="100%">
                  <tr>
                    <td style="font-size:22px;font-weight:800;">${appName}</td>
                    <td align="right">
                      <span style="display:inline-block;background:#c00;color:#fff;padding:6px 10px;border-radius:4px;font-size:12px;font-weight:700;">Top Stories</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <h2 style="margin:0 0 12px;color:#111827;font-size:24px;">${heading}</h2>
                <p style="margin:0 0 20px;color:#374151;line-height:1.6;font-size:15px;">${body}</p>
                <a href="${ctaLink}" style="display:inline-block;background:#003366;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:4px;font-weight:700;">${ctaLabel}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 24px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;background:#f8fafc;">
                Stay updated with ${appName}. This is an automated notification from your newsroom feed.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};

export const sendNotificationEmail = async (params: {
    to: string;
    subject: string;
    heading: string;
    body: string;
    ctaLabel?: string;
    ctaLink?: string;
}) => {
    const { to, subject, heading, body, ctaLabel, ctaLink } = params;

    const settings = await AppSettingsModel.findOne({ key: "main" }).lean();

    const appName = settings?.general?.websiteName || "ASO CENTRAL";
    const websiteUrl = settings?.general?.websiteUrl || "";
    const smtpHost = settings?.security?.smtpHost || "";
    const smtpPort = Number(settings?.security?.smtpPort || 587);
    const smtpUser = settings?.security?.smtpUser || "";
    const smtpPass = settings?.security?.smtpPass || "";

    if (!smtpHost || !smtpUser || !smtpPass) {
        throw new Error("SMTP settings are missing");
    }

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
        from: `"${appName}" <${smtpUser}>`,
        to,
        subject,
        html: buildNotificationTemplate({
            appName,
            heading,
            body,
            ctaLabel,
            ctaLink: ctaLink || websiteUrl,
        }),
    });

    console.log("Notification email result:", {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
    });

    return info;
};
