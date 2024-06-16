import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "feedbacker verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return { success: true, message: "verification email send successfully" };
  } catch (emailErr) {
    console.log("error in sending email ", emailErr);
    return { success: false, message: "failed to send verification email" };
  }
}
