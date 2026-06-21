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

export async function sendTestimonialEmail(data: {
  name: string
  email?: string
  role?: string
  projectType: string | null
  rating: number
  comment: string
  approveUrl?: string
  declineUrl?: string
}) {
  const name = escapeHtml(data.name)
  const email = escapeHtml(data.email || 'Not provided')
  const role = escapeHtml(data.role || 'Not provided')
  const projectType = escapeHtml(data.projectType || 'Not specified')
  const rating = Math.max(1, Math.min(5, Math.round(data.rating)))
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)
  const comment = escapeHtml(data.comment)

  return await transporter.sendMail({
    from: `"ORBIT Reviews" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: data.email || process.env.EMAIL_USER,
    subject: `New Review: ${rating}★ from ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #FF751F; margin-bottom: 8px;">New Client Review</h2>
        <p style="font-size: 24px; margin: 0 0 20px; color: #FF751F;">${stars} (${rating}/5)</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: bold; width: 120px;">Name</td>
            <td style="padding: 12px 8px;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: bold;">Email</td>
            <td style="padding: 12px 8px;">${data.email ? `<a href="mailto:${email}">${email}</a>` : email}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: bold;">Role / Title</td>
            <td style="padding: 12px 8px;">${role}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: bold;">Project Type</td>
            <td style="padding: 12px 8px;">${projectType}</td>
          </tr>
          <tr>
            <td style="padding: 12px 8px; font-weight: bold; vertical-align: top;">Review</td>
            <td style="padding: 12px 8px; white-space: pre-wrap;">${comment}</td>
          </tr>
        </table>
        ${data.approveUrl && data.declineUrl ? `
          <div style="margin-top: 28px; text-align: center;">
            <a href="${data.approveUrl}" style="display: inline-block; margin: 6px; padding: 14px 28px; background-color: #16a34a; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 8px;">✓ Approve &amp; Publish</a>
            <a href="${data.declineUrl}" style="display: inline-block; margin: 6px; padding: 14px 28px; background-color: #dc2626; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 8px;">✗ Decline</a>
          </div>
          <p style="text-align: center; font-size: 12px; color: #999; margin-top: 12px;">Approving will publish this review on orbitpk.com instantly.</p>
        ` : ''}
        <hr style="margin-top: 20px; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #999; margin-top: 12px;">Submitted from the orbitpk.com homepage review form.</p>
      </div>
    `,
  })
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
