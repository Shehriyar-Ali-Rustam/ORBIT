import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(data: {
  name: string
  email: string
  phone?: string
  service: string
  budget: string
  message: string
}) {
  return await resend.emails.send({
    from: 'Orbit Contact <noreply@orbittech.io>',
    to: [process.env.CONTACT_EMAIL!],
    replyTo: data.email,
    subject: `New Contact: ${data.name} — ${data.service}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF751F;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold;">Name</td><td>${data.name}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Email</td><td>${data.email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Phone</td><td>${data.phone || 'Not provided'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Service</td><td>${data.service}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Budget</td><td>${data.budget}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Message</td><td>${data.message}</td></tr>
        </table>
      </div>
    `,
  })
}

export async function sendFreelancerApplyEmail(data: Record<string, string>) {
  return await resend.emails.send({
    from: 'Orbit Freelancers <noreply@orbittech.io>',
    to: [process.env.CONTACT_EMAIL!],
    subject: `New Freelancer Application: ${data.name} — ${data.role}`,
    html: `<pre>${JSON.stringify(data, null, 2)}</pre>`,
  })
}
