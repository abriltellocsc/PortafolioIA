"""
Servicio de email para notificaciones de cambios de plan.
"""
import smtplib
import os
from email.message import EmailMessage


def send_upgrade_email(user_name: str, user_email: str):
    """
    Envía un email notificando que el usuario se pasó a plan Premium
    """
    msg = EmailMessage()
    msg["Subject"] = "¡Bienvenido a PortafolioIA Premium!"
    msg["From"] = "no-reply@portafolioai.com"
    msg["To"] = user_email
    
    body = f"""
Hola {user_name},

¡Felicitaciones por pasar a plan Premium! 🎉

Ahora tienes acceso a:
✓ Consultas ilimitadas de IA
✓ Análisis avanzado de portafolio
✓ Portafolios ilimitados
✓ Acceso a todas las funciones
✓ Soporte Premium 24/7
✓ Reportes personalizados

Disfruta al máximo de PortafolioIA.

Si tienes dudas, contáctanos a soporte@portafolioai.com

Saludos,
Equipo PortfolioAI
"""
    msg.set_content(body)
    
    try:
        smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_user = os.getenv("SMTP_USER")
        smtp_pass = os.getenv("SMTP_PASS")
        
        if smtp_user and smtp_pass:
            smtp = smtplib.SMTP(smtp_host, smtp_port)
            smtp.starttls()
            smtp.login(smtp_user, smtp_pass)
            smtp.send_message(msg)
            smtp.quit()
            print(f"✅ Email de upgrade enviado a {user_email}")
        else:
            print(f"⚠️ SMTP no configurado. Email de upgrade no enviado a {user_email}")
    except Exception as e:
        print(f"❌ Error enviando email de upgrade: {e}")


def send_cancel_email(user_name: str, user_email: str):
    """
    Envía un email notificando que el usuario canceló su plan Premium
    """
    msg = EmailMessage()
    msg["Subject"] = "Tu plan Premium ha sido cancelado - PortafolioIA"
    msg["From"] = "no-reply@portafolioai.com"
    msg["To"] = user_email
    
    body = f"""
Hola {user_name},

Tu plan Premium ha sido cancelado exitosamente.

Ahora estás usando el plan Gratuito con:
• 3 consultas de IA por mes
• 3 portafolios máximo
• Acceso limitado a funciones

Si cambias de opinión, puedes volver a Premium en cualquier momento desde la sección de Planes.

¿Tienes preguntas? Contáctanos a soporte@portafolioai.com

Saludos,
Equipo PortfolioAI
"""
    msg.set_content(body)
    
    try:
        smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_user = os.getenv("SMTP_USER")
        smtp_pass = os.getenv("SMTP_PASS")
        
        if smtp_user and smtp_pass:
            smtp = smtplib.SMTP(smtp_host, smtp_port)
            smtp.starttls()
            smtp.login(smtp_user, smtp_pass)
            smtp.send_message(msg)
            smtp.quit()
            print(f"✅ Email de cancelación enviado a {user_email}")
        else:
            print(f"⚠️ SMTP no configurado. Email de cancelación no enviado a {user_email}")
    except Exception as e:
        print(f"❌ Error enviando email de cancelación: {e}")
