import { AppBar } from "@mui/material"
import logo from '../../assets/img/audiocodes-logo-colored.svg'
import { Theme } from "../../theme/theme"
import RecordingStatus from "../recording-status/recording-status.component"
import classes from './header.module.scss'
const Header = ()=>{
    return (
        <AppBar className={classes.header} sx={{padding:"1rem", background:Theme.palette.background.default, display:"grid", gridTemplateColumns:"1fr 1fr 1fr"}} position="fixed">
            <img className={classes.logoImg} src={logo} alt="" />
            <RecordingStatus/>
        </AppBar>
    )
}

export default Header