import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  shape: {
    borderRadius: '3px'
  },
  palette: {
    mode: 'light',
    text: {
      main: '#000'
    },
    background: {
      default: '#f5f5f5'
    },
    primary: {
      main: '#ffffff',
      light: '#1C6EBA',
      dark: '#6281a5',
    },
    secondary: {
      main: '#FFD500',
      light: '#FDC500',
    },
    popup: {
      background: '#FFFFFF99',
      text: '#000000'
    },
    tiletypes: {
      empty: {
        main: '#ffffff'
      },
      miss: {
        main: '#fbfbfb',
        dark: '#e1e1e1',
        light: '#ffffff'
      },
      green: {
        main: '#87bf49',
        dark: '#2e5812',
        light: '#87bf49'
      },
      yellow: {
        main: '#ffe738',
        dark: '#f8bf2b',
        light: '#fce037'
      },
      blue: {
        main: '#40a4f7',
        dark: '#1c7ad6',
        light: '#40a4f7',
        text: '#ffe738'
      }
    },
    key_backspace: {
      main: '#fddbcf',
      dark: '#e7693d'
    },
    key_enter: {
      main: '#e2fbd4',
      dark: '#58bd15'
    },
    key_green: {
      main: '#72df29',
      dark: '#58bd15'
    },
    key_yellow: {
      main: '#f3d936',
      dark: '#cdb624'
    },
    key_blue: {
      main: '#40a4f7',
      dark: '#1c7ad6'
    },
    key_miss: {
      main: '#9f9f9f',
      dark: '#9f9f9f'
    },
    copy_symbol: '#000000AA'
  },
});

export default lightTheme;