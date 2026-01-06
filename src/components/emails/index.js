export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send email');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

{/* Send a welcome email to new users */}
export const sendWelcomeEmail = async (userEmail, userName) => {
  return sendEmail({
    to: userEmail,
    subject: 'Welcome to Okuper!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #003399;">Welcome to Okuper, ${userName}!</h1>
        <p>Thank you for joining Okuper - your trusted platform for renting and buying homes directly.</p>
        <p>No agents. No hidden fees. Just verified people and real homes.</p>
        <br/>
        <p>Get started by:</p>
        <ul>
          <li>Completing your profile</li>
          <li>Browsing available properties</li>
          <li>Saving your favorite homes</li>
        </ul>
        <br/>
        <p>If you have any questions, feel free to contact our support team.</p>
        <br/>
        <p>Best regards,<br/>The Okuper Team</p>
      </div>
    `,
  });
};