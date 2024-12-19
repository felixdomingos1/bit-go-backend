import { Request, Response, Router } from 'express';
import nodemailer, { TransportOptions } from 'nodemailer';
import { config } from 'dotenv';

config();

interface EmailConfig {
  service: string;
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface InviteEmailData {
  to: string;
  name: string;
  registrationLink: string;
  baseUrl: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly emailConfig: EmailConfig;

  constructor() {
    this.emailConfig = {
      service: process.env.EMAIL_SERVICE || '',
      host: process.env.EMAIL_HOST || '',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASSWORD || '',
      },
    };

    this.transporter = nodemailer.createTransport(this.emailConfig as TransportOptions);
  }

  private generateInviteEmailTemplate({ name, registrationLink, baseUrl }: Omit<InviteEmailData, 'to'>): string {
   

    return `
      <html>
        <head>
          <style>
            .container {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .button {
              background-color: #4CAF50;
              border: none;
              color: white;
              padding: 15px 32px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 16px;
              margin: 4px 2px;
              cursor: pointer;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Convite para Registro</h2>
            <p>Olá ${name},</p>
            <p>Você foi convidado para se registrar em nossa plataforma.</p>
            <p>Para completar seu cadastro, clique no botão abaixo:</p>
            <p>
              <a href="${registrationLink}" class="button">Completar Cadastro</a>
            </p>
            <p>Ou copie e cole o seguinte link no seu navegador:</p>
            <p>${registrationLink}</p>
            <p>Este link é válido por 48 horas.</p>
            <p>
              Atenciosamente,<br>
              Equipe da Empresa
            </p>
          </div>
        </body>
      </html>
    `;
  }

  public async sendInviteEmail({ to, name, registrationLink, baseUrl }: InviteEmailData): Promise<void> {
    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'Nome da Empresa',
        address: process.env.EMAIL_USER || '',
      },
      to,
      subject: 'Convite para Registro na Plataforma',
      html: this.generateInviteEmailTemplate({ name, registrationLink, baseUrl }),
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw new Error('Falha ao enviar email de convite');
    }
  }
}

const emailService = new EmailService();
const router = Router();

router.post('/send-invite', async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, name, registrationLink } = req.body;

    if (!email || !name || !registrationLink) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios faltando',
      });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    await emailService.sendInviteEmail({
      to: email,
      name,
      registrationLink,
      baseUrl,
    });

    return res.status(200).json({
      success: true,
      message: 'Email de convite enviado com sucesso',
    });

  } catch (error) {
    console.error('Erro na rota de envio de convite:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao processar o envio do convite',
    });
  }
});

export default router;