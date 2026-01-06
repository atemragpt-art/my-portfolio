/**
 * i18n UI translations
 * 
 * Переводы для всех языков (ru, en, de, es, fr, pt, it, tr, ar, zh) подготовлены.
 * 
 * Все языки добавлены в astro.config.mjs с fallback на 'en' для языков без существующих страниц.
 * Это позволяет использовать переводы UI для всех языков, даже если страницы ещё не созданы.
 * При переходе на /de/about Astro автоматически перенаправит на английскую версию (/en/about).
 */

export const languages = {
  ru: 'Русский',
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  pt: 'Português',
  it: 'Italiano',
  tr: 'Türkçe',
  ar: 'العربية',
  zh: '中文',
} as const;

export const defaultLang = 'ru' as const;

export type Lang = keyof typeof languages;

// Языки с RTL направлением текста
export const rtlLanguages: Lang[] = ['ar'];

// Проверка RTL языка
export function isRtl(lang: Lang): boolean {
  return rtlLanguages.includes(lang);
}

// UI строки для интерфейса
export const ui = {
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.about': 'О компании',
    'nav.services': 'Услуги',
    'nav.expertise': 'Экспертиза',
    'nav.industries': 'Отрасли',
    'nav.cases': 'Кейсы',
    'nav.blog': 'Блог',
    'nav.contact': 'Контакты',
    'nav.faq': 'FAQ',
    
    // Footer
    'footer.company': 'Компания',
    'footer.resources': 'Ресурсы',
    'footer.legal': 'Правовая информация',
    'footer.contacts': 'Контакты',
    'footer.copyright': '© {year} Все права защищены.',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.terms': 'Условия использования',
    'footer.career': 'Карьера',
    
    // Forms
    'form.name': 'Имя',
    'form.email': 'Email или телефон',
    'form.message': 'Сообщение',
    'form.submit': 'Отправить',
    'form.required': 'Обязательное поле',
    'form.success': 'Сообщение успешно отправлено!',
    'form.error': 'Произошла ошибка. Попробуйте позже.',
    
    // Common
    'common.readMore': 'Подробнее',
    'common.backHome': 'Вернуться на главную',
    'common.loading': 'Загрузка...',
    'common.empty': 'Пока нет опубликованных элементов.',
    
    // Errors
    'error.404': 'Страница не найдена',
    'error.404.description': 'К сожалению, запрашиваемая страница не существует.',
    
    // Meta
    'meta.home.title': 'Главная',
    'meta.home.description': 'Эксперты в области NC программирования, постпроцессоров и симуляции ЧПУ',
  },
  
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.expertise': 'Expertise',
    'nav.industries': 'Industries',
    'nav.cases': 'Cases',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.faq': 'FAQ',
    
    'footer.company': 'Company',
    'footer.resources': 'Resources',
    'footer.legal': 'Legal',
    'footer.contacts': 'Contacts',
    'footer.copyright': '© {year} All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.career': 'Careers',
    
    'form.name': 'Name',
    'form.email': 'Email or phone',
    'form.message': 'Message',
    'form.submit': 'Send',
    'form.required': 'Required field',
    'form.success': 'Message sent successfully!',
    'form.error': 'An error occurred. Please try again later.',
    
    'common.readMore': 'Read more',
    'common.backHome': 'Back to home',
    'common.loading': 'Loading...',
    'common.empty': 'No published items yet.',
    
    'error.404': 'Page not found',
    'error.404.description': 'Sorry, the page you requested does not exist.',
    
    'meta.home.title': 'Home',
    'meta.home.description': 'Experts in NC programming, postprocessors and CNC simulation',
  },
  
  de: {
    'nav.home': 'Startseite',
    'nav.about': 'Über uns',
    'nav.services': 'Dienstleistungen',
    'nav.expertise': 'Expertise',
    'nav.industries': 'Branchen',
    'nav.cases': 'Referenzen',
    'nav.blog': 'Blog',
    'nav.contact': 'Kontakt',
    'nav.faq': 'FAQ',
    
    'footer.company': 'Unternehmen',
    'footer.resources': 'Ressourcen',
    'footer.legal': 'Rechtliches',
    'footer.contacts': 'Kontakt',
    'footer.copyright': '© {year} Alle Rechte vorbehalten.',
    'footer.privacy': 'Datenschutz',
    'footer.terms': 'Nutzungsbedingungen',
    'footer.career': 'Karriere',
    
    'form.name': 'Name',
    'form.email': 'E-Mail oder Telefon',
    'form.message': 'Nachricht',
    'form.submit': 'Senden',
    'form.required': 'Pflichtfeld',
    'form.success': 'Nachricht erfolgreich gesendet!',
    'form.error': 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später.',
    
    'common.readMore': 'Mehr erfahren',
    'common.backHome': 'Zurück zur Startseite',
    'common.loading': 'Laden...',
    'common.empty': 'Noch keine veröffentlichten Elemente.',
    
    'error.404': 'Seite nicht gefunden',
    'error.404.description': 'Die angeforderte Seite existiert leider nicht.',
    
    'meta.home.title': 'Startseite',
    'meta.home.description': 'Experten für NC-Programmierung, Postprozessoren und CNC-Simulation',
  },
  
  es: {
    'nav.home': 'Inicio',
    'nav.about': 'Nosotros',
    'nav.services': 'Servicios',
    'nav.expertise': 'Experiencia',
    'nav.industries': 'Industrias',
    'nav.cases': 'Casos',
    'nav.blog': 'Blog',
    'nav.contact': 'Contacto',
    'nav.faq': 'FAQ',
    
    'footer.company': 'Empresa',
    'footer.resources': 'Recursos',
    'footer.legal': 'Legal',
    'footer.contacts': 'Contactos',
    'footer.copyright': '© {year} Todos los derechos reservados.',
    'footer.privacy': 'Política de privacidad',
    'footer.terms': 'Términos de uso',
    'footer.career': 'Carreras',
    
    'form.name': 'Nombre',
    'form.email': 'Email o teléfono',
    'form.message': 'Mensaje',
    'form.submit': 'Enviar',
    'form.required': 'Campo obligatorio',
    'form.success': '¡Mensaje enviado con éxito!',
    'form.error': 'Ocurrió un error. Inténtelo más tarde.',
    
    'common.readMore': 'Leer más',
    'common.backHome': 'Volver al inicio',
    'common.loading': 'Cargando...',
    'common.empty': 'Aún no hay elementos publicados.',
    
    'error.404': 'Página no encontrada',
    'error.404.description': 'Lo sentimos, la página solicitada no existe.',
    
    'meta.home.title': 'Inicio',
    'meta.home.description': 'Expertos en programación NC, postprocesadores y simulación CNC',
  },
  
  fr: {
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.services': 'Services',
    'nav.expertise': 'Expertise',
    'nav.industries': 'Industries',
    'nav.cases': 'Références',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.faq': 'FAQ',
    
    'footer.company': 'Entreprise',
    'footer.resources': 'Ressources',
    'footer.legal': 'Mentions légales',
    'footer.contacts': 'Contacts',
    'footer.copyright': '© {year} Tous droits réservés.',
    'footer.privacy': 'Politique de confidentialité',
    'footer.terms': "Conditions d'utilisation",
    'footer.career': 'Carrières',
    
    'form.name': 'Nom',
    'form.email': 'Email ou téléphone',
    'form.message': 'Message',
    'form.submit': 'Envoyer',
    'form.required': 'Champ obligatoire',
    'form.success': 'Message envoyé avec succès !',
    'form.error': 'Une erreur est survenue. Réessayez plus tard.',
    
    'common.readMore': 'En savoir plus',
    'common.backHome': "Retour à l'accueil",
    'common.loading': 'Chargement...',
    'common.empty': 'Aucun élément publié pour le moment.',
    
    'error.404': 'Page non trouvée',
    'error.404.description': 'Désolé, la page demandée n\'existe pas.',
    
    'meta.home.title': 'Accueil',
    'meta.home.description': 'Experts en programmation NC, postprocesseurs et simulation CNC',
  },
  
  pt: {
    'nav.home': 'Início',
    'nav.about': 'Sobre',
    'nav.services': 'Serviços',
    'nav.expertise': 'Expertise',
    'nav.industries': 'Indústrias',
    'nav.cases': 'Casos',
    'nav.blog': 'Blog',
    'nav.contact': 'Contato',
    'nav.faq': 'FAQ',
    
    'footer.company': 'Empresa',
    'footer.resources': 'Recursos',
    'footer.legal': 'Legal',
    'footer.contacts': 'Contatos',
    'footer.copyright': '© {year} Todos os direitos reservados.',
    'footer.privacy': 'Política de Privacidade',
    'footer.terms': 'Termos de Uso',
    'footer.career': 'Carreiras',
    
    'form.name': 'Nome',
    'form.email': 'Email ou telefone',
    'form.message': 'Mensagem',
    'form.submit': 'Enviar',
    'form.required': 'Campo obrigatório',
    'form.success': 'Mensagem enviada com sucesso!',
    'form.error': 'Ocorreu um erro. Tente novamente mais tarde.',
    
    'common.readMore': 'Saiba mais',
    'common.backHome': 'Voltar ao início',
    'common.loading': 'Carregando...',
    'common.empty': 'Nenhum item publicado ainda.',
    
    'error.404': 'Página não encontrada',
    'error.404.description': 'Desculpe, a página solicitada não existe.',
    
    'meta.home.title': 'Início',
    'meta.home.description': 'Especialistas em programação NC, pós-processadores e simulação CNC',
  },
  
  it: {
    'nav.home': 'Home',
    'nav.about': 'Chi siamo',
    'nav.services': 'Servizi',
    'nav.expertise': 'Competenze',
    'nav.industries': 'Settori',
    'nav.cases': 'Casi studio',
    'nav.blog': 'Blog',
    'nav.contact': 'Contatti',
    'nav.faq': 'FAQ',
    
    'footer.company': 'Azienda',
    'footer.resources': 'Risorse',
    'footer.legal': 'Note legali',
    'footer.contacts': 'Contatti',
    'footer.copyright': '© {year} Tutti i diritti riservati.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Termini di utilizzo',
    'footer.career': 'Carriere',
    
    'form.name': 'Nome',
    'form.email': 'Email o telefono',
    'form.message': 'Messaggio',
    'form.submit': 'Invia',
    'form.required': 'Campo obbligatorio',
    'form.success': 'Messaggio inviato con successo!',
    'form.error': 'Si è verificato un errore. Riprova più tardi.',
    
    'common.readMore': 'Scopri di più',
    'common.backHome': 'Torna alla home',
    'common.loading': 'Caricamento...',
    'common.empty': 'Nessun elemento pubblicato ancora.',
    
    'error.404': 'Pagina non trovata',
    'error.404.description': 'Spiacenti, la pagina richiesta non esiste.',
    
    'meta.home.title': 'Home',
    'meta.home.description': 'Esperti in programmazione NC, postprocessori e simulazione CNC',
  },
  
  tr: {
    'nav.home': 'Ana Sayfa',
    'nav.about': 'Hakkımızda',
    'nav.services': 'Hizmetler',
    'nav.expertise': 'Uzmanlık',
    'nav.industries': 'Sektörler',
    'nav.cases': 'Projeler',
    'nav.blog': 'Blog',
    'nav.contact': 'İletişim',
    'nav.faq': 'SSS',
    
    'footer.company': 'Şirket',
    'footer.resources': 'Kaynaklar',
    'footer.legal': 'Yasal',
    'footer.contacts': 'İletişim',
    'footer.copyright': '© {year} Tüm hakları saklıdır.',
    'footer.privacy': 'Gizlilik Politikası',
    'footer.terms': 'Kullanım Koşulları',
    'footer.career': 'Kariyer',
    
    'form.name': 'Ad',
    'form.email': 'E-posta veya telefon',
    'form.message': 'Mesaj',
    'form.submit': 'Gönder',
    'form.required': 'Zorunlu alan',
    'form.success': 'Mesaj başarıyla gönderildi!',
    'form.error': 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
    
    'common.readMore': 'Devamını oku',
    'common.backHome': 'Ana sayfaya dön',
    'common.loading': 'Yükleniyor...',
    'common.empty': 'Henüz yayınlanmış öğe yok.',
    
    'error.404': 'Sayfa bulunamadı',
    'error.404.description': 'Üzgünüz, istenen sayfa mevcut değil.',
    
    'meta.home.title': 'Ana Sayfa',
    'meta.home.description': 'NC programlama, postişlemciler ve CNC simülasyonu uzmanları',
  },
  
  ar: {
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.services': 'الخدمات',
    'nav.expertise': 'الخبرة',
    'nav.industries': 'الصناعات',
    'nav.cases': 'المشاريع',
    'nav.blog': 'المدونة',
    'nav.contact': 'اتصل بنا',
    'nav.faq': 'الأسئلة الشائعة',
    
    'footer.company': 'الشركة',
    'footer.resources': 'الموارد',
    'footer.legal': 'قانوني',
    'footer.contacts': 'جهات الاتصال',
    'footer.copyright': '© {year} جميع الحقوق محفوظة.',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'شروط الاستخدام',
    'footer.career': 'الوظائف',
    
    'form.name': 'الاسم',
    'form.email': 'البريد الإلكتروني أو الهاتف',
    'form.message': 'الرسالة',
    'form.submit': 'إرسال',
    'form.required': 'حقل مطلوب',
    'form.success': 'تم إرسال الرسالة بنجاح!',
    'form.error': 'حدث خطأ. يرجى المحاولة مرة أخرى لاحقاً.',
    
    'common.readMore': 'اقرأ المزيد',
    'common.backHome': 'العودة للرئيسية',
    'common.loading': 'جاري التحميل...',
    'common.empty': 'لا توجد عناصر منشورة بعد.',
    
    'error.404': 'الصفحة غير موجودة',
    'error.404.description': 'عذراً، الصفحة المطلوبة غير موجودة.',
    
    'meta.home.title': 'الرئيسية',
    'meta.home.description': 'خبراء في برمجة NC ومعالجات البيانات ومحاكاة CNC',
  },
  
  zh: {
    'nav.home': '首页',
    'nav.about': '关于我们',
    'nav.services': '服务',
    'nav.expertise': '专业知识',
    'nav.industries': '行业',
    'nav.cases': '案例',
    'nav.blog': '博客',
    'nav.contact': '联系方式',
    'nav.faq': '常见问题',
    
    'footer.company': '公司',
    'footer.resources': '资源',
    'footer.legal': '法律信息',
    'footer.contacts': '联系方式',
    'footer.copyright': '© {year} 版权所有。',
    'footer.privacy': '隐私政策',
    'footer.terms': '使用条款',
    'footer.career': '职业机会',
    
    'form.name': '姓名',
    'form.email': '电子邮件或电话',
    'form.message': '留言',
    'form.submit': '发送',
    'form.required': '必填项',
    'form.success': '消息发送成功！',
    'form.error': '发生错误，请稍后再试。',
    
    'common.readMore': '了解更多',
    'common.backHome': '返回首页',
    'common.loading': '加载中...',
    'common.empty': '暂无已发布的内容。',
    
    'error.404': '页面未找到',
    'error.404.description': '抱歉，您请求的页面不存在。',
    
    'meta.home.title': '首页',
    'meta.home.description': 'NC编程、后处理器和CNC仿真专家',
  },
} as const;

// Тип для ключей переводов
export type TranslationKey = keyof typeof ui[typeof defaultLang];
