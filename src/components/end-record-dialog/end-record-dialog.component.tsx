import { Box, Button, DialogActions, Divider } from "@mui/material";
import DialogContent from "@mui/material/DialogContent"
import Typography from "@mui/material/Typography"
import { useTranslation } from "react-i18next";
import { Theme } from "../../theme/theme";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import logo from '../../assets/img/audiocodes-logo-colored.svg'
import transcriptionImage from '../../assets/img/transcription-image.svg'
import classes from './end-record-dialog.module.scss'
import { useContext } from "react";
import { AppContext } from "../../context/default.context";
import moment from "moment";
import Moment from "react-moment";
interface Props{
    onClose : ()=> void,
    duration : any,
    startTime: any
}
const EndRecordDialog = (props:Props)=>{
    const { t } = useTranslation(['translation']);
    const { state, dispatch } = useContext(AppContext);
    const handleClose = ()=>{
        props.onClose()
    }
    const calcDurationFromClips = ()=>{
        // const seconds = state.meeting.clips[state.meeting.clips.length -1].end
        console.log("SECONDS -> ",props.duration)
        console.log("START TIME -> ",props.startTime)
        const duration = moment.duration(props.duration,'seconds');
        console.log(duration.humanize())
        console.log("DURATION TIME -> ", moment.utc(props.duration * 1000).format('HH:mm:ss'))
        return moment.utc(props.duration * 1000).format('HH:mm:ss')
    }
    
    return (
        <DialogContent dir="rtl" sx={{backgroundColor:Theme.palette.background.paper, padding:"1rem"}}>
            <Box sx={{display:"flex"}}>
                <div>
                    <Typography sx={{fontSize:"3em", padding:"1rem" , marginBottom:"1rem"}}>{t("recorder.recording-dialog.title")}</Typography>
                    <Box sx={{display:"flex", padding:"1rem"}}>
                        <Typography sx={{fontSize:"1em",color: Theme.palette.secondary.main}}>{t("recorder.recording-dialog.duration-label")} : </Typography>
                        {
                            props.duration ?
                            <Typography sx={{fontSize:"1em"}}>{moment.utc(props.duration * 1000).format('HH:mm:ss')}</Typography>:
                            <></>
                        }
                        
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