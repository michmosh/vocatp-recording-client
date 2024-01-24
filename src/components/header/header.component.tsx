import { AppBar } from "@mui/material"
import logo from '../../assets/img/audiocodes-logo-colored.svg'
import { Theme } from "../../theme/theme"
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
            <div className={classes.rightLogoWrapper}>
                {
                    secondaryIcon !== undefined ? <img className={classes.rightLogo} alt="icon" src={secondaryIcon} /> : <></>
                }
                {
                    primaryIcon !== undefined ? <img className={classes.rightLogo} alt="icon" src={primaryIcon} /> : <></>
                }
                
                
                
            </div>
        </AppBar>
    )
}

export default Header