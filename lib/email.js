import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD
    }
});

// Function to send verification email for registration
export async function sendVerificationEmail(email, code) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_SERVER_USER,
            to: email,
            subject: 'CARE Registration Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #a8738b; text-align: center;">Email Verification</h2>
                    <p>Hello,</p>
                    <p>Thank you for registering with CARE. To complete your registration, please use the following verification code:</p>
                    <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px;">
                        <h1 style="color: #a8738b; margin: 0; letter-spacing: 5px;">${code}</h1>
                    </div>
                    <p>This code will expire in 60 seconds for security reasons.</p>
                    <p>If you did not attempt to register with CARE, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">
                        This is an automated message, please do not reply to this email.
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Verification email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        return false;
    }
}

// Function to send password reset verification email
export async function sendPasswordResetEmail(email, code) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_SERVER_USER,
            to: email,
            subject: 'Password Reset Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #a8738b; text-align: center;">Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset your password for your CARE account. To proceed with the password reset, please use the following verification code:</p>
                    <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px;">
                        <h1 style="color: #a8738b; margin: 0; letter-spacing: 5px;">${code}</h1>
                    </div>
                    <p>This code will expire in 1 hour for security reasons.</p>
                    <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">
                        This is an automated message, please do not reply to this email.
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return false;
    }
} 