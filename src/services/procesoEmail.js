import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import validator from 'validator';
dotenv.config();

// Configuración de las credenciales de Gmail
// TODO: Podrías querer mover el usuario a una variable de entorno también
const userGmail = 'jnserrudo@gmail.com'; 
const passAppGmail = process.env.GMAIL_PASS;

// Configuración del transporter de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: userGmail,
    pass: passAppGmail,
  },
});

export const sendContactEmail = async (nombreCompleto, emailRemitente, asunto, mensaje) => {
  console.log('\n  ========================================');
  console.log('  📧 INICIO - sendContactEmail');
  console.log('  ========================================');
  console.log('  📝 Parámetros recibidos:');
  console.log('    - nombreCompleto:', nombreCompleto);
  console.log('    - emailRemitente:', emailRemitente);
  console.log('    - asunto:', asunto);
  console.log('    - mensaje:', mensaje);
  
  try {
    // Validar email del remitente
    console.log('  🔍 Validando email del remitente...');
    if (!validator.isEmail(emailRemitente)) {
      console.log('  ❌ Email inválido:', emailRemitente);
      throw new Error('La dirección de correo electrónico no es válida');
    }
    console.log('  ✅ Email válido');

    // Email de destino 
    const emailDestino = 'grottigni@ucasal.edu.ar'// 'jnserrudo@gmail.com';
    console.log('  📬 Email de destino:', emailDestino);
    console.log('  📤 Email de origen (Gmail):', userGmail);
    console.log('  🔄 Reply-To:', emailRemitente);

    const mailOptions = {
      from: `"${nombreCompleto} (vía Portal Museo)" <${userGmail}>`, // Muestra el nombre de quien envía
      to: emailDestino, // Hacia tu email
      subject: `Contacto: ${asunto}`,
      replyTo: emailRemitente, // Para que puedas responder directamente
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; }
              .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
              .header { background-color: #007BFF; color: white; padding: 15px; border-radius: 8px 8px 0 0; }
              .content { padding: 20px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #555; }
              .value { color: #333; margin-top: 5px; }
              .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 15px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Nuevo Mensaje de Contacto</h2>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Nombre:</div>
                  <div class="value">${nombreCompleto}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value">${emailRemitente}</div>
                </div>
                <div class="field">
                  <div class="label">Asunto:</div>
                  <div class="value">${asunto}</div>
                </div>
                <div class="field">
                  <div class="label">Mensaje:</div>
                  <div class="value">${mensaje}</div>
                </div>
              </div>
              <div class="footer">
                <p>Este mensaje fue enviado desde el formulario de contacto del Portal del Museo</p>
                <p>&copy; ${new Date().getFullYear()} Portal del Museo. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    console.log('  📧 mailOptions configurado:');
    console.log('    - from:', mailOptions.from);
    console.log('    - to:', mailOptions.to);
    console.log('    - subject:', mailOptions.subject);
    console.log('    - replyTo:', mailOptions.replyTo);
    
    console.log('  🚀 Enviando email con transporter...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log('  📬 Respuesta de nodemailer:');
    console.log('    - messageId:', info.messageId);
    console.log('    - accepted:', info.accepted);
    console.log('    - rejected:', info.rejected);
    console.log('    - response:', info.response);
    
    if (info.rejected.length > 0) {
      console.log('  ❌ Email rechazado por el servidor');
      console.log('    - Rechazados:', info.rejected);
      throw new Error('Se rechazó el envío');
    }
    
    console.log('  ✅ Email enviado exitosamente!');
    console.log('  ========================================\n');
    return info;
    
  } catch (error) {
    console.log('  💥 ERROR en sendContactEmail');
    console.error('    - Mensaje de error:', error.message);
    console.error('    - Error completo:', error);
    console.log('  ========================================\n');
    return { err: error.message };
  }
};

