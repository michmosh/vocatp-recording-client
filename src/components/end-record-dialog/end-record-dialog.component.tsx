import { Box, Button, CircularProgress, DialogActions, Divider } from "@mui/material";
import DialogContent from "@mui/material/DialogContent"
import Typography from "@mui/material/Typography"
import { useTranslation } from "react-i18next";
import { Theme } from "../../theme/theme";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import logo from '../../assets/img/audiocodes-logo-colored.svg'
import transcriptionImage from '../../assets/img/transcription-image.svg'
import classes from './end-record-dialog.module.scss'
import moment from "moment";
import { useEffect, useState } from "react";
import CustomIcons from "../custom-icons/custom-icons.component";
interface Props{
    onClose : ()=> void,
    duration : any,
    startTime: any
}
const EndRecordDialog = (props:Props)=>{
    const { t } = useTranslation(['translation']);
    const [showLoader , setShowLoader] = useState(true)
    const [buttonDisabled , setButtonDisabled] = useState(true)
    const [uploadSuccess , setUploadSuccess] = useState(false)
    const [uploadError , setUploadError] = useState(false)
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

    const renderUploadMessage = ()=>{
        if(uploadSuccess){
            return (
                <Box sx={{display:"flex", padding:"1rem", gap:"0.5rem", alignItems:"center"}}>
                    <Typography sx={{fontSize:"1em", color:"rgba(32, 202, 123, 1)"}}>{t("recorder.recording-dialog.success-message")}</Typography>
                    <CheckCircleOutlineIcon sx={{fontSize:"1em",color:"rgba(32, 202, 123, 1)"}} />
                </Box>
            )
        }
        if(uploadError){
            return (
                <Box sx={{display:"flex", padding:"1rem", gap:"0.5rem", alignItems:"center"}}>
                    <Typography sx={{fontSize:"1em", color:"rgba(240, 86, 86, 1)"}}>{t("recorder.recording-dialog.error-message")}</Typography>
                    <ErrorOutlineIcon sx={{fontSize:"1em", color:"rgba(240, 86, 86, 1)"}} />
                </Box>
            )
        }
        return <></>
    }

    useEffect(()=>{
        window.addEventListener("onPostResultServerSuccess",(data)=>{
            setUploadSuccess(true)
            setShowLoader(false)
            setButtonDisabled(false)
        })
        window.addEventListener("onPostResultServerError",(data)=>{
            setShowLoader(false)
            setUploadError(true)
            setButtonDisabled(false)
        })

        return ()=>{
            window.removeEventListener("onPostResultServerSuccess",(data)=>{

            })
            window.removeEventListener("onPostResultServerError",(data)=>{

            })
        }
    })
    
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
                        {
                            showLoader  ? 
                                <Box sx={{padding:"1rem"}}>
                                    <Box sx={{display:"flex", gap:"0.5rem", alignItems:"center"}}>
                                        <Typography sx={{fontSize:"1em", color:"rgba(60, 168, 255, 1)"}}>{t("recorder.recording-dialog.uploading-message")}</Typography>
                                        <QueryBuilderIcon sx={{fontSize:"1em", color:"rgba(60, 168, 255, 1)"}} />
                                    </Box>
                                    <Typography sx={{fontSize:"1em", color:"#bda81e"}}>{t("recorder.recording-dialog.warning-message")}</Typography>
                               </Box>
                            :
                            <></>
                        }
                        {
                           renderUploadMessage()
                        }
                    </Box>
                </div>
                <div className={classes.transcriptionImageWrapper}>
                    <img className={classes.transcriptionImage} src={transcriptionImage} alt="" />
                </div>
               
            </Box>
            
            <DialogActions sx={{marginTop:"3rem", marginBottom:"1rem", justifyContent:"flex-start", gap:"2rem"}}>
                <Button disabled={buttonDisabled} sx={{padding:"0.4rem 3.5rem"}} size="medium" onClick={handleClose} variant="contained" >{t("recorder.recording-dialog.close-button")}</Button>
                {
                    showLoader ? <CircularProgress color="secondary" /> : <></>
                }
                
            </DialogActions>
            <Divider></Divider>
            <div className={classes.dialogFooter}>
                <div>
                    <CustomIcons />
                </div>
                <img className={classes.logoImg} src={logo} alt="" />
            </div>
        </DialogContent>
    )
}

export default EndRecordDialog