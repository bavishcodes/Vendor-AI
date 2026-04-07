import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'hi', 'ta', 'te', 'kn'] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = locales.includes((requested ?? 'en') as (typeof locales)[number])
    ? (requested as (typeof locales)[number])
    : 'en';

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
