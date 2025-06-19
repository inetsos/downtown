// src/plugins/vuetify.js
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  // 봄봄 테마
  // theme: {
  //   defaultTheme: 'customTheme',
  //   themes: {
  //     customTheme: {
  //       dark: false,
  //       colors: {
  //         primary: '#FFD700',      // Yellow
  //         secondary: '#FF1493',    // Deep Pink
  //         accent: '#FFC0CB',       // Pink
  //         info: '#FFB6C1',         // Light Pink
  //       },
  //     },
  //   },
  // },
  // 하삼동 테마
  theme: {
    defaultTheme: 'logoTheme',
    themes: {
      logoTheme: {
        dark: false,
        colors: {
          primary: '#C17767',
          secondary: '#9C5C5A',
          accent: '#C6886E',
          info: '#C5A78C',
        },
      },
    },
  },
})

export default vuetify
