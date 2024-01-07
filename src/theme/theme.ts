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
      fontFamily: '"Open Sans" , sans-serif',
      subtitle1: {
        fontFamily: '"Open Sans" , sans-serif',
      },
    },
    components:{
      MuiCssBaseline:{
        styleOverrides: {
          body: {
            scrollbarColor: "green yellow",
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              backgroundColor: "#2b2b2b",
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: 8,
              backgroundColor: "#6b6b6b",
              minHeight: 24,
              border: "3px solid #2b2b2b",
            },
            "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
              backgroundColor: "#959595",
            },
            "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
              backgroundColor: "#959595",
            },
            "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#959595",
            },
            "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
              backgroundColor: "#2b2b2b",
            }
          }
        }
      },
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
        variants:[
          {
           props:{variant: "text"} ,
           style:{
              background:'transparent',
              color:'rgba(60, 168, 255, 1)'
           }
          }
        ],
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
      },
      MuiTooltip:{
        styleOverrides:{
          tooltip:{
            backgroundColor:"rgba(80, 93, 111, 1)",
            fontSize:"1em"
          },
          arrow:{
            "&::before":{
              backgroundColor: 'rgba(80, 93, 111, 1)'
            }
          }
        }
      }
    }
  };
export const Theme = createTheme(themeOptions)