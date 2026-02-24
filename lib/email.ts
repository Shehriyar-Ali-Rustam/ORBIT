import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendContactEmail(data: {
  name: string
  email: string
  phone?: string
  service: string
  budget: string
  message: string
}) {
  return await transporter.sendMail({
    from: `"ORBIT Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: data.email,
    subject: `New Contact: ${data.name} — ${data.service}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #FF751F; margin-bottom: 20px;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: bold; width: 120px;">Name</td>
            <td style="padding: 12px 8px;">${data.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: bold;">Email</td>
            <td style="padding: 12px 8px;"><a href="mailto:${data.email}">${data.email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: bold;">Phone</td>
            <td style="padding: 12px 8px;">${data.phone || 'Not provided'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: bold;">Service</td>
            <td style="padding: 12px 8px;">${data.service}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: bold;">Budget</td>
            <td style="padding: 12px 8px;">${data.budget}</td>
          </tr>
          <tr>
            <td style="padding: 12px 8px; font-weight: bold; vertical-align: top;">Message</td>
            <td style="padding: 12px 8px; white-space: pre-wrap;">${data.message}</td>
          </tr>
        </table>
        <hr style="margin-top: 20px; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #999; margin-top: 12px;">Sent from ORBIT website contact form</p>
      </div>
    `,
  })
}

export async function sendFreelancerApplyEmail(data: Record<string, string>) {
  return await transporter.sendMail({
    from: `"ORBIT Freelancers" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `New Freelancer Application: ${data.name} — ${data.role}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #FF751F;">New Freelancer Application</h2>
        <pre style="background: #f5f5f5; padding: 16px; border-radius: 8px; overflow-x: auto;">${JSON.stringify(data, null, 2)}</pre>
        <hr style="margin-top: 20px; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #999; margin-top: 12px;">Sent from ORBIT website freelancer application</p>
      </div>
    `,
  })
}
