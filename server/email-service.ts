import { MailService } from '@sendgrid/mail';
import { OrderStatus } from '@shared/schema';

// Initialize SendGrid
if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable is not set, email notifications will not work");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

const SENDER_EMAIL = 'no-reply@kasa-clothing.com';

interface EmailParams {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("Email not sent - SENDGRID_API_KEY not set");
    return false;
  }

  try {
    // Use sandbox mode for testing - emails won't actually be sent
    // but will be validated by the SendGrid API
    await mailService.send({
      to: params.to,
      from: SENDER_EMAIL,
      subject: params.subject,
      text: params.text,
      html: params.html,
      mail_settings: {
        sandbox_mode: {
          enable: true
        }
      }
    });
    console.log(`Email notification would be sent to ${params.to} (sandbox mode)`);
    console.log(`Subject: ${params.subject}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendOrderStatusChangeEmail(
  customerEmail: string,
  orderId: number,
  status: OrderStatus,
  trackingCode?: string | null
): Promise<boolean> {
  // Get status-specific email content
  const { subject, text, html } = getOrderStatusEmailContent(orderId, status, trackingCode);
  
  return await sendEmail({
    to: customerEmail,
    subject,
    text,
    html
  });
}

function getOrderStatusEmailContent(orderId: number, status: OrderStatus, trackingCode?: string | null) {
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Common text elements
  const header = `KASA Clothing - Order #${orderId}`;
  const greeting = `Hello,`;
  const footer = `Thank you for shopping with KASA Clothing!\n\nIf you have any questions, please contact our customer support.`;

  let subject = '';
  let statusMessage = '';
  let additionalInfo = '';

  // Status-specific content
  switch (status) {
    case "pending":
      subject = `Order Received: Your KASA Order #${orderId}`;
      statusMessage = `We've received your order #${orderId} on ${formattedDate}.`;
      additionalInfo = `We're currently processing your payment. Once confirmed, we'll begin preparing your order.`;
      break;
    
    case "processing":
      subject = `Order Being Processed: Your KASA Order #${orderId}`;
      statusMessage = `Your order #${orderId} is now being processed.`;
      additionalInfo = `Our team is preparing your items for shipment. We'll notify you once your order ships.`;
      break;
    
    case "shipped":
      subject = `Order Shipped: Your KASA Order #${orderId}`;
      statusMessage = `Great news! Your order #${orderId} has been shipped.`;
      additionalInfo = trackingCode
        ? `You can track your package using the following tracking code: ${trackingCode}`
        : `Your order is on its way to you.`;
      break;
    
    case "delivered":
      subject = `Order Delivered: Your KASA Order #${orderId}`;
      statusMessage = `Your order #${orderId} has been delivered.`;
      additionalInfo = `We hope you enjoy your new KASA products! If there are any issues with your order, please contact our customer support.`;
      break;
    
    case "cancelled":
      subject = `Order Cancelled: Your KASA Order #${orderId}`;
      statusMessage = `Your order #${orderId} has been cancelled.`;
      additionalInfo = `If you didn't request this cancellation or have any questions, please contact our customer support.`;
      break;
    
    default:
      subject = `Order Update: Your KASA Order #${orderId}`;
      statusMessage = `There has been an update to your order #${orderId}.`;
      additionalInfo = `Please check your account for more details.`;
  }

  // Construct plain text email
  const text = `${header}\n\n${greeting}\n\n${statusMessage}\n\n${additionalInfo}\n\n${footer}`;

  // Construct HTML email
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #000000; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0;">KASA Clothing</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
        <h2 style="color: #333333;">Order #${orderId}</h2>
        <p style="font-size: 16px; color: #333333;">${greeting}</p>
        <p style="font-size: 16px; color: #333333;">${statusMessage}</p>
        <p style="font-size: 16px; color: #333333;">${additionalInfo}</p>
        
        ${status === "shipped" && trackingCode ? `
          <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="font-size: 16px; color: #333333; margin: 0;">
              <strong>Tracking Code:</strong> ${trackingCode}
            </p>
          </div>
        ` : ''}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="font-size: 14px; color: #666666;">Thank you for shopping with KASA Clothing!</p>
          <p style="font-size: 14px; color: #666666;">If you have any questions, please contact our customer support.</p>
        </div>
      </div>
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666666;">
        &copy; ${new Date().getFullYear()} KASA Clothing. All rights reserved.
      </div>
    </div>
  `;

  return { subject, text, html };
}