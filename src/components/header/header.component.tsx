import { AppBar, Box } from "@mui/material"
import logo from '../../assets/img/audiocodes-logo-colored.svg'
import { Theme } from "../../theme/theme"
import CustomIcons from "../custom-icons/custom-icons.component"
import RecordingStatus from "../recording-status/recording-status.component"
import classes from './header.module.scss'
const Header = ()=>{
    //@ts-ignore
    const primaryIcon = BASE_CONFIG.primaryIcon
    //@ts-ignore
    const secondaryIcon = BASE_CONFIG.secondaryIcon
    return (
        <AppBar className={classes.header} sx={{padding:"1rem", background:Theme.palette.background.default, display:"grid", gridTemplateColumns:"1fr 1fr 1fr"}} position="fixed">
            <img className={classes.logoImg} src={logo} alt="audiocodes icon" />
            <RecordingStatus/>
            {/* @ts */}
            <Box sx={{justifySelf:"flex-end"}}><CustomIcons /></Box>
        </AppBar>
    )
}

export default Header