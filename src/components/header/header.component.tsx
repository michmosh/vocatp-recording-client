import { AppBar } from "@mui/material"
import logo from '../../assets/img/audiocodes-logo-colored.svg'
import { Theme } from "../../theme/theme"
import classes from './header.module.scss'
const Header = ()=>{
    return (
        <AppBar className={classes.header} sx={{padding:"1rem", background:Theme.palette.background.default}} position="fixed">
            <img className={classes.logoImg} src={logo} alt="" />
        </AppBar>
    )
}

export default Header