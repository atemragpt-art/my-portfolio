import type { APIRoute } from 'astro';
import { submitContactForm } from '@/actions/contact-form';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const result = await submitContactForm(formData);

    if (result.success) {
      return new Response(
        JSON.stringify({ success: true, message: result.message }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, message: result.message, errors: result.errors }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Внутренняя ошибка сервера' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
