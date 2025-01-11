import nodemailer from 'nodemailer';
import path from 'path';
import ejs from 'ejs';


class EmailService {
    private static instance: EmailService;
    private transporter: nodemailer.Transporter;

    private constructor() {
        // Configurer le transporteur Nodemailer
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST, // Exemple : 'smtp.example.com'
            port: Number(process.env.EMAIL_PORT), // Exemple : 587
            secure: false, // true pour le port 465, false pour d'autres ports
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

    private async renderTemplate(templateName: string, data: any): Promise<string> {
        const templatePath = path.join(__dirname, '../../presntation', 'email-templates', `${templateName}.ejs`);
        return new Promise((resolve, reject) => {
            ejs.renderFile(templatePath, data, (err, str) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(str);
                }
            });
        });
    }

    private async sendEmailWithRetry(mailOptions: nodemailer.SendMailOptions, retries: number = 3): Promise<void> {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                await this.transporter.sendMail(mailOptions);
                console.log('Email sent successfully');
                return;
            } catch (error) {
                console.error(`Error sending email (attempt ${attempt}):`, error);
                if (attempt === retries) {
                    throw error;
                }
            }
        }
    }

    public async sendEmail(to: string, subject: string, text: string, html: string): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html,
        };

        await this.sendEmailWithRetry(mailOptions);
    }

    public async sendTaskNotificationEmail(to: string, data: any): Promise<void> {
        const html = await this.renderTemplate('taskNotification', data);
        await this.sendEmail(to, 'New Task Assigned', data.content, html);
    }

    public async sendCrewNotificationEmail(to: string, data: any): Promise<void> {
        const html = await this.renderTemplate('crewNotification', data);
        await this.sendEmail(to, 'New Crew Created', data.content, html);
    }

    public async sendProjectNotificationEmail(to: string, data: any): Promise<void> {
        const html = await this.renderTemplate('projectNotification', data);
        await this.sendEmail(to, 'New Project Created', data.content, html);
    }
}

export default EmailService.getInstance();