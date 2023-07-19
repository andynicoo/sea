import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import enLocale from './en'
import zhLocale from './zh'
import zhtwLocale from './zhtw'
import thLocale from './th'
import ptLocale from './pt'
import viLocale from './vi'
import inLocale from './in'
import maLocale from './ma'
Vue.use(VueI18n)

const messages = {
  en_bg: {
    ...enLocale
  },
  zh_cn: {
    ...zhLocale
  },
  zh_tw: {
    ...zhtwLocale
  },
  th_th: {
    ...thLocale
  },
  pt_pt: {
    ...ptLocale
  },
  vi_vn: {
    ...viLocale
  },
  in_id: {
    ...inLocale
  },
  ma_ma: {
    ...maLocale
  }
}
export function getLanguage() {
  const chooseLanguage = Cookies.get('language')
  if (chooseLanguage) return chooseLanguage
  // console.log(chooseLanguage);
  // if has not choose language
  const language = (
    navigator.language || navigator.browserLanguage
  ).toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'zh_cn'
}

// 对照表 https://vuetifyjs.com/zh-Hans/features/internationalization/#section-5feb901f516595e8
export function getLanguageForVuetify() {
  const chooseLanguage = Cookies.get('language')
  if (chooseLanguage == 'zh_cn') {
    return 'zhHans'
  } else if (chooseLanguage == 'zh_tw') {
    return 'zhHant'
  } else if (chooseLanguage == 'th_th') {
    return 'th'
  } else if (chooseLanguage == 'in_id') {
    return 'id'
  } else if (chooseLanguage == 'pt_pt') {
    return 'pt'
  } else {
    // vuetify中， 马来 越南，转英语
    return 'en'
  }
}

const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: getLanguage(),
  // set locale messages
  messages
})

export default i18n
