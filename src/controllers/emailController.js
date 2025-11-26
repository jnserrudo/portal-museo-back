// src/controllers/emailController.js
import { sendContactEmail } from '../services/procesoEmail.js';

export class EmailController {
  static enviarEmail = async (req, res, next) => {
    console.log('\n========================================');
    console.log('📧 INICIO - EmailController.enviarEmail');
    console.log('========================================');
    
    try {
      console.log('📥 Body recibido:', JSON.stringify(req.body, null, 2));
      
      const { nombreCompleto, emailRemitente, asunto, mensaje } = req.body;

      console.log('📋 Datos extraídos:');
      console.log('  - nombreCompleto:', nombreCompleto);
      console.log('  - emailRemitente:', emailRemitente);
      console.log('  - asunto:', asunto);
      console.log('  - mensaje:', mensaje);

      // Validación básica
      if (!nombreCompleto || !emailRemitente || !asunto || !mensaje) {
        console.log('❌ VALIDACIÓN FALLIDA - Campos faltantes');
        console.log('  - nombreCompleto presente:', !!nombreCompleto);
        console.log('  - emailRemitente presente:', !!emailRemitente);
        console.log('  - asunto presente:', !!asunto);
        console.log('  - mensaje presente:', !!mensaje);
        
        return res.status(400).json({ 
          success: false,
          message: 'Todos los campos son requeridos: nombreCompleto, emailRemitente, asunto, mensaje' 
        });
      }

      console.log('✅ Validación exitosa - Todos los campos presentes');
      console.log('🚀 Llamando a sendContactEmail...');

      // Enviar el email usando el servicio
      const resultado = await sendContactEmail(nombreCompleto, emailRemitente, asunto, mensaje);

      console.log('📬 Resultado de sendContactEmail:', resultado);

      // Verificar si hubo error
      if (resultado.err) {
        console.log('❌ ERROR en el envío del email:', resultado.err);
        
        return res.status(500).json({ 
          success: false,
          message: 'Error al enviar el correo',
          error: resultado.err 
        });
      }

      console.log('✅ Email enviado exitosamente!');
      console.log('📨 MessageId:', resultado.messageId);

      // Respuesta exitosa
      const respuesta = { 
        success: true,
        message: 'Mensaje de contacto enviado exitosamente',
        info: resultado.messageId 
      };
      
      console.log('📤 Enviando respuesta al cliente:', respuesta);
      console.log('========================================\n');
      
      res.status(200).json(respuesta);

    } catch (error) {
      console.log('💥 EXCEPCIÓN CAPTURADA en EmailController');
      console.error('Error completo:', error);
      console.error('Stack trace:', error.stack);
      console.log('========================================\n');
      
      next(error);
    }
  };
}
