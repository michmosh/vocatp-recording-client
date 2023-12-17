import { Box, Button, DialogActions, Divider } from "@mui/material";
import DialogContent from "@mui/material/DialogContent"
import Typography from "@mui/material/Typography"
import { useTranslation } from "react-i18next";
import { Theme } from "../../theme/theme";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import logo from '../../assets/img/audiocodes-logo-colored.svg'
import transcriptionImage from '../../assets/img/transcription-image.svg'
import classes from './end-record-dialog.module.scss'
interface Props{
    onClose : ()=> void,
    duration : string
}
const EndRecordDialog = (props:Props)=>{
    const { t } = useTranslation(['translation']);
    const handleClose = ()=>{
        props.onClose()
    }
    
    return (
        <DialogContent dir="rtl" sx={{backgroundColor:Theme.palette.background.paper, padding:"1rem"}}>
            <Box sx={{display:"flex"}}>
                <div>
                    <Typography sx={{fontSize:"3em", padding:"1rem" , marginBottom:"1rem"}}>{t("recorder.recording-dialog.title")}</Typography>
                    <Box sx={{display:"flex", padding:"1rem"}}>
                        <Typography sx={{fontSize:"1em",color: Theme.palette.secondary.main}}>{t("recorder.recording-dialog.duration-label")} : </Typography>
                        <Typography sx={{fontSize:"1em"}}>{props.duration}</Typography>
                        
                    </Box>
                    <Box sx={{display:"flex", padding:"1rem", gap:"0.5rem", alignItems:"center"}}>
                        <Typography sx={{fontSize:"1em", color:"rgba(32, 202, 123, 1)"}}>{t("recorder.recording-dialog.success-message")}</Typography>
                        <CheckCircleOutlineIcon sx={{fontSize:"1em",color:"rgba(32, 202, 123, 1)"}} />
                    </Box>
                </div>
                <div className={classes.transcriptionImageWrapper}>
                    <img className={classes.transcriptionImage} src={transcriptionImage} alt="" />
                </div>
               
            </Box>
           
            <DialogActions sx={{marginTop:"3rem", marginBottom:"1rem"}}>
                <Button onClick={handleClose} variant="contained" >{t("recorder.recording-dialog.close-button")}</Button>
            </DialogActions>
            <Divider></Divider>
            <div className={classes.dialogFooter}>
                <img className={classes.logoImg} src={logo} alt="" />
            </div>
        </DialogContent>
    )
}

export default EndRecordDialog