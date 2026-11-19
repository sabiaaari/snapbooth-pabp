import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Snapbooth" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verifikasi Akun Snapbooth Kamu",
    html: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h2>Selamat datang di Snapbooth!</h2>
        <p>Klik tombol atau tautan di bawah ini untuk memverifikasi alamat email kamu (berlaku selama 24 jam):</p>
        <p>
          <a href="${verifyUrl}" style="display:inline-block;padding:10px 20px;background:#3b0d11;color:#fff;text-decoration:none;border-radius:6px;">
            Verifikasi Email Sekarang
          </a>
        </p>
        <p>Jika tombol tidak berfungsi, salin tautan ini ke browser: ${verifyUrl}</p>
      </div>
    `,
  });
}