import { colors } from "@mui/material";
import createTheme, { ThemeOptions } from "@mui/material/styles/createTheme";
export const themeOptions: ThemeOptions = {
    direction:'rtl',
    palette: {
      mode: 'dark',
      primary: {
        main: '#718394',
        contrastText: '#693c3c',
      },
      secondary: {
        main: 'rgba(142, 142, 169, 1)',
      },
      background: {
        default: 'rgba(59, 66, 84, 1)',
        paper: "rgba(45, 50, 63, 0.78)"
      },
      text:{
        primary:"rgba(246, 242, 228, 1)",
      }
    },
    typography: {
      subtitle1: {
        fontFamily: 'Open Sans',
      },
    },
    components:{
      MuiTextField:{
        styleOverrides: {
          root: {
            '& label.Mui-focused': {
              color: 'rgba(0, 255, 255, 1)',
            },
            '& .MuiFilledInput-underline.Mui-focused:after, .MuiFilledInput-underline.Mui-focused:before' :{
              borderBottomColor: "rgba(0, 255, 255, 1)"
            }
          },
        },
      },
      MuiButton:{
        styleOverrides:{
          root:{
            background : "linear-gradient(90deg, rgba(86, 170, 255, 1) 0%, rgba(134, 54, 255, 1) 100%);",
            "&.Mui-disabled":{
              background:'rgba(255, 255, 255, 0.12)'
            },
            color:"rgba(246, 242, 228, 1)" 
          }
        }
      },
      MuiChip:{
        styleOverrides:{
          root:{
            borderRadius:"4px"
          }
        }
      },
      MuiRadio:{
        styleOverrides:{
          root:{
            color:"rgba(246, 242, 228, 1)",
            "&.Mui-checked":{
              color:"rgba(246, 242, 228, 1)"
            }
          }
        }
      },
      MuiSnackbarContent:{
        styleOverrides:{
          root:{
            backgroundColor:'rgba(171, 221, 211, 0.12)'
          }
        }
      },
      MuiCircularProgress:{
        styleOverrides:{
          root:{
            color:'#1976d2'
          }
        }
      }
    }
  };
export const Theme = createTheme(themeOptions)