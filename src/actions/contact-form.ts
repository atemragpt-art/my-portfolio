import { z } from 'zod';
import nodemailer from 'nodemailer';

/**
 * Экранирование HTML для защиты от XSS
 */
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

// Схема валидации формы
const contactFormSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  contact: z.string().min(3, 'Укажите email или телефон'),
  message: z.string().min(10, 'Сообщение должно содержать минимум 10 символов'),
});

// Отправка в Telegram
async function sendToTelegram(data: z.infer<typeof contactFormSchema>) {
  const botToken = import.meta.env.TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('Telegram credentials not configured');
    return;
  }

  // Форматируем текст с HTML для лучшей читаемости (экранируем пользовательские данные)
  const text = `<b>Новая заявка с сайта</b>\n\n<b>Имя:</b> ${escapeHtml(data.name)}\n<b>Контакты:</b> ${escapeHtml(data.contact)}\n\n<b>Сообщение:</b>\n${escapeHtml(data.message)}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to send to Telegram:', error);
    throw error;
  }
}

// Отправка Email через Nodemailer
async function sendEmail(data: z.infer<typeof contactFormSchema>) {
  const smtpHost = import.meta.env.SMTP_HOST;
  const smtpPort = import.meta.env.SMTP_PORT;
  const smtpSecure = import.meta.env.SMTP_SECURE === 'true';
  const smtpUser = import.meta.env.SMTP_USER;
  const smtpPass = import.meta.env.SMTP_PASS;
  const smtpFrom = import.meta.env.SMTP_FROM || smtpUser;
  const smtpTo = import.meta.env.SMTP_TO;

  if (!smtpHost || !smtpUser || !smtpPass || !smtpTo) {
    console.warn('SMTP credentials not configured');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort || '587'),
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: smtpTo,
      subject: `Новая заявка с сайта от ${escapeHtml(data.name)}`,
      text: `Имя: ${data.name}\nКонтакты: ${data.contact}\n\nСообщение:\n${data.message}`,
      html: `
        <h2>Новая заявка с сайта</h2>
        <p><strong>Имя:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Контакты:</strong> ${escapeHtml(data.contact)}</p>
        <p><strong>Сообщение:</strong></p>
        <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    // Не выбрасываем ошибку, чтобы не прерывать отправку в Telegram
  }
}

// Основная функция обработки формы
export async function submitContactForm(formData: FormData) {
  try {
    // Извлекаем данные из FormData
    const rawData = {
      name: formData.get('name')?.toString() || '',
      contact: formData.get('contact')?.toString() || '',
      message: formData.get('message')?.toString() || '',
    };

    // Валидация через Zod
    const validatedData = contactFormSchema.parse(rawData);

    // Отправляем в Telegram и Email параллельно
    await Promise.allSettled([
      sendToTelegram(validatedData),
      sendEmail(validatedData),
    ]);

    return {
      success: true,
      message: 'Сообщение успешно отправлено',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Ошибка валидации',
        errors: error.errors,
      };
    }

    console.error('Form submission error:', error);
    return {
      success: false,
      message: 'Произошла ошибка при отправке формы',
    };
  }
}
