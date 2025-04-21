import en from './locales/en.json' with { type: 'json' }; 
import cn from './locales/cn.json' with { type: 'json' };
// const en = (await import('./locales/en.json')).default;
// const cn = (await import('./locales/cn.json')).default;

export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en,
      cn
    }
  }))