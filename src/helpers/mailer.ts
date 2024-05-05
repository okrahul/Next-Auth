import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

type SendEmailTypes = {
  email: string;
  emailType: string;
  userId: string;
};

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: SendEmailTypes) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    const verificationHTML = `<p>Please click the following link to verify your email:</p><a href="${process.env.DOMAIN}/verify-email?token=${hashedToken}"
    >Verify Email</a>`;

    const resetHTML = `<p>Please click the following link to reset your password:</p><a href= "${process.env.DOMAIN}/reset-password?token=${hashedToken}"> Reset Password</a>`;

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "4c99925f3db9a6", // !no
        pass: "486c4258ad3b35", // !no
      },
    });

    const mailOption = {
      from: "rahulsharma@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: emailType === "VERIFY" ? verificationHTML : resetHTML,

      // **  copy url ${process.env.DOMAIN}/verify-email?token=${hashedToken}
    };

    const mailResponse = await transporter.sendMail(mailOption);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};
