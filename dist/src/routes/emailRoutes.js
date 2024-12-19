"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class EmailService {
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
        this.transporter = nodemailer_1.default.createTransport(this.emailConfig);
    }
    generateInviteEmailTemplate({ name, registrationLink, baseUrl }) {
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
    sendInviteEmail(_a) {
        return __awaiter(this, arguments, void 0, function* ({ to, name, registrationLink, baseUrl }) {
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
                yield this.transporter.sendMail(mailOptions);
            }
            catch (error) {
                console.error('Erro ao enviar email:', error);
                throw new Error('Falha ao enviar email de convite');
            }
        });
    }
}
const emailService = new EmailService();
const router = (0, express_1.Router)();
router.post('/send-invite', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, registrationLink } = req.body;
        if (!email || !name || !registrationLink) {
            return res.status(400).json({
                success: false,
                message: 'Campos obrigatórios faltando',
            });
        }
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        yield emailService.sendInviteEmail({
            to: email,
            name,
            registrationLink,
            baseUrl,
        });
        return res.status(200).json({
            success: true,
            message: 'Email de convite enviado com sucesso',
        });
    }
    catch (error) {
        console.error('Erro na rota de envio de convite:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao processar o envio do convite',
        });
    }
}));
exports.default = router;
