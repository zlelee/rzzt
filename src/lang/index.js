import Vue from 'vue'
import VueI18n from 'vue-i18n'
import cookie from 'js-cookie'
import elementEN from 'element-ui/lib/locale/lang/en'
import elementZH from 'element-ui/lib/locale/lang/zh-CN'
import customZH from './zh'
import customEN from './en'
Vue.use(VueI18n)

export default new VueI18n({
  locale: cookie.get('language') || 'zh',
  messages: {
    en: {
      ...elementEN,
      ...customEN
    },
    zh: {
      ...elementZH,
      ...customZH
    }
  }
})
