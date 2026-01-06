// src/actions/index.ts
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import nodemailer from 'nodemailer';
import {
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  SMTP_TO,
} from 'astro:env/server';

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

// Отправка в Telegram
async function sendToTelegram(data: { name: string; contact: string; message: string }) {
  const botToken = TELEGRAM_BOT_TOKEN;
  const chatId = TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('Telegram credentials not configured');
    // Выбрасываем ошибку, чтобы Promise.allSettled правильно определил статус
    throw new Error('Telegram credentials not configured');
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
async function sendEmail(data: { name: string; contact: string; message: string }) {
  const smtpHost = SMTP_HOST;
  const smtpPort = SMTP_PORT;
  const smtpSecure = SMTP_SECURE === 'true';
  const smtpUser = SMTP_USER;
  const smtpPass = SMTP_PASS;
  const smtpFrom = SMTP_FROM || smtpUser;
  const smtpTo = SMTP_TO;

  if (!smtpHost || !smtpUser || !smtpPass || !smtpTo) {
    console.warn('SMTP credentials not configured');
    // Выбрасываем ошибку, чтобы Promise.allSettled правильно определил статус
    throw new Error('SMTP credentials not configured');
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost!,
      port: parseInt(smtpPort || '587', 10),
      secure: smtpSecure,
      auth: {
        user: smtpUser!,
        pass: smtpPass!,
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
    // Выбрасываем ошибку, чтобы Promise.allSettled правильно определил статус
    throw error;
  }
}

// Экспортируем Actions
export const server = {
  submitContactForm: defineAction({
    input: z.object({
      name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
      contact: z.string().min(3, 'Укажите email или телефон'),
      message: z.string().min(10, 'Сообщение должно содержать минимум 10 символов'),
    }),
    handler: async (input) => {
      try {
        // Отправляем в Telegram и Email параллельно
        const results = await Promise.allSettled([
          sendToTelegram(input),
          sendEmail(input),
        ]);

        // Проверяем, удалось ли отправить хотя бы куда-то
        const anySuccess = results.some(r => r.status === 'fulfilled');

        if (!anySuccess) {
          console.error('All dispatch methods failed', results);
          throw new Error('Не удалось отправить сообщение. Свяжитесь с нами по телефону.');
        }

        return {
          success: true,
          message: 'Сообщение успешно отправлено',
        };
      } catch (error) {
        console.error('Form submission error:', error);
        throw new Error('Произошла ошибка при отправке формы');
      }
    },
  }),
};
