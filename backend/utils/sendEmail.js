import { Resend } from "resend";

export const sendEmail = async (email, otp) => {

    if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is missing");
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
        from: "Satisfying Jobs <onboarding@resend.dev>",
        to: email,
        subject: "Email Verification OTP",
        html: `
            <h5 style="color: "Blue"">Satisfying jobs</h5>
            <h2>Email Verification</h2>
            <h4> Thank you for signing up</h4>
            <p>Enter this code to verify your email id.</p>
            <h1>${otp}</h1>
        `
    });
};