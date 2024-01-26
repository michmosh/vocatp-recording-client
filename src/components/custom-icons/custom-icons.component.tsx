import { Box } from "@mui/material"
import classes from './custom-icons.module.scss'
const CustomIcons = ()=>{
     //@ts-ignore
     const primaryIcon = BASE_CONFIG.primaryIcon
     //@ts-ignore
     const secondaryIcon = BASE_CONFIG.secondaryIcon

     if(!primaryIcon && !secondaryIcon) return <></>
    return (
        <Box sx={{display:"flex"}}>
            {
                secondaryIcon !== undefined ? <img className={classes.rightLogo} alt="icon" src={secondaryIcon} /> : <></>
            }
            {
                primaryIcon !== undefined ? <img className={classes.rightLogo} alt="icon" src={primaryIcon} /> : <></>
            }
        </Box>
    )
}

export default CustomIcons