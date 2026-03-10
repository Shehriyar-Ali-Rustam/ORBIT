import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

/** Escape HTML special characters to prevent injection in email templates */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function sendContactEmail(data: {
  name: string
  email: string
  phone?: string
  service: string
  budget: string
  message: string
}) {
  const name = escapeHtml(data.name)
  const email = escapeHtml(data.email)
  const phone = escapeHtml(data.phone || 'Not provided')
  const service = escapeHtml(data.service)
  const budget = escapeHtml(data.budget)
  const message = escapeHtml(data.message)

  return await transporter.sendMail({
    from: `"ORBIT Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: data.email,
    subject: `New Contact: ${name} — ${service}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #70E6ED; margin-bottom: 20px;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: bold; width: 120px;">Name</td>
            <td style="padding: 12px 8px;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: bold;">Email</td>
            <td style="padding: 12px 8px;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: bold;">Phone</td>
            <td style="padding: 12px 8px;">${phone}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: bold;">Service</td>
            <td style="padding: 12px 8px;">${service}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: bold;">Budget</td>
            <td style="padding: 12px 8px;">${budget}</td>
          </tr>
          <tr>
            <td style="padding: 12px 8px; font-weight: bold; vertical-align: top;">Message</td>
            <td style="padding: 12px 8px; white-space: pre-wrap;">${message}</td>
          </tr>
        </table>
        <hr style="margin-top: 20px; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #999; margin-top: 12px;">Sent from ORBIT website contact form</p>
      </div>
    `,
  })
}
