import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export async function sendWelcomeEmail(
  to: string,
  tempPassword: string,
  baseName?: string
) {
  const baseLine = baseName
    ? `<p style="margin:0 0 16px">You selected <strong>${baseName}</strong> — your base info is ready on your dashboard.</p>`
    : "";

  await getResend().emails.send({
    from: "PCSing.us <noreply@pcsing.us>",
    to,
    subject: "Welcome to PCSing.us — Your Account is Ready",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
        <h1 style="color:#1B2A4A;font-size:24px;margin:0 0 16px">Welcome to PCSing.us!</h1>
        ${baseLine}
        <p style="margin:0 0 16px">Your account has been created. Here are your login details:</p>
        <div style="background:#f1f5f9;border-radius:8px;padding:16px;margin:0 0 24px">
          <p style="margin:0 0 8px"><strong>Email:</strong> ${to}</p>
          <p style="margin:0"><strong>Temporary Password:</strong> ${tempPassword}</p>
        </div>
        <a href="https://pcsing.us/login" style="display:inline-block;background:#1B2A4A;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          Log In Now
        </a>
        <p style="margin:24px 0 0;font-size:13px;color:#6b7280">We recommend changing your password after your first login.</p>
      </div>
    `,
  });
}
