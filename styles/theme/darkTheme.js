import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  shape: {
    borderRadius: '3px'
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#1e1e1e',
      light: '#3A54D8',
      dark: '#1a1c28'
    },
    secondary: {
      main: '#FFD500',
      light: '#FDC500',
    },
    popup: {
      background: '#292929AA',
      text: '#FFFFFF'
    },
    tiletypes: {
      empty: {
        main: 'rgba(255, 255, 255, 0.05)'
      },
      miss: {
        main: '#595959',
        dark: '#292929',
        light: '#696969'
      },
      green: {
        main: '#87bf49',
        dark: '#2e5812',
        light: '#87bf49'
      },
      yellow: {
        main: '#fee637',
        dark: '#d98303',
        light: '#fce037'
      },
      blue: {
        main: '#023fc3',
        dark: '#032670',
        light: '#4663ef'
      }
    },
    key_backspace: {
      main: '#2e1d17',
      dark: '#542312'
    },
    key_enter: {
      main: '#1e2619',
      dark: '#23341a'
    },
    key_green: {
      main: '#418315',
      dark: '#2e5812'
    },
    key_yellow: {
      main: '#a38c00',
      dark: '#64590d'
    },
    key_blue: {
      main: '#041b8f',
      dark: '#001168'
    },
    key_miss: {
      main: '#444444',
      dark: '#444444'
    },
    resulttext: '#FFFFFF44'
  },
});

export default darkTheme;