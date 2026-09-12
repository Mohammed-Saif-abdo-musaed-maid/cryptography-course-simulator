export type Language = 'ar' | 'en'

export interface I18nContextValue {
  language: Language
  dir: 'rtl' | 'ltr'
  t: (key: string) => string
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

export const LANGUAGES: Language[] = ['ar', 'en']