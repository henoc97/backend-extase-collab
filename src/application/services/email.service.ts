import nodemailer from 'nodemailer';

class EmailService {
    private static instance: EmailService;
    private transporter: nodemailer.Transporter;

    private constructor() {
        // Configurer le transporteur Nodemailer
        this.transporter = nodemailer.createTransport({
            // host: process.env.EMAIL_HOST, // Exemple : 'smtp.example.com'
            // port: Number(process.env.EMAIL_PORT), // Exemple : 587
            // secure: false, // true pour le port 465, false pour d'autres ports
            auth: {
                user: process.env.EMAIL_USER, // Votre email
                pass: process.env.EMAIL_PASS, // Votre mot de passe
            },
        });
    }

    public static getInstance(): EmailService {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }
        return EmailService.instance;
    }

    public async sendEmail(to: string, subject: string, text: string): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        await this.transporter.sendMail(mailOptions);
    }
}

export default EmailService.getInstance(); 