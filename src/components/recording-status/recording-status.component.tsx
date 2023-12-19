import { Box, SnackbarContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../context/default.context";
import { Theme } from "../../theme/theme";
import classes from './recording-status.module.scss'
import WifiIcon from '@mui/icons-material/Wifi';
import MicIcon from '@mui/icons-material/Mic';
const STATUS_ENUM = {
    STT_SERVER_CONNETCED: "STT_SERVER_CONNETCED",
    STT_SERVER_ERROR: "STT_SERVER_ERROR",
    MICROPHONE_CONNETCED: "MICROPHONE_CONNETCED",
    MICROPHONE_ERROR: "MICROPHONE_ERROR",
}
const RecordingStatus = ()=>{
    const { state, dispatch } = useContext(AppContext);
    const { t } = useTranslation(['translation']);
    const [status , setStatus] = useState("")
    
    const getSnackBarClassName = ()=>{
        if(status === STATUS_ENUM.STT_SERVER_CONNETCED || status === STATUS_ENUM.MICROPHONE_CONNETCED) return classes.snackBarSuccess
        if(status === STATUS_ENUM.STT_SERVER_ERROR || status === STATUS_ENUM.MICROPHONE_ERROR) return classes.snackBarError
    }
    const renderSnackBarMessage = ()=>{
        if(status === STATUS_ENUM.STT_SERVER_CONNETCED) return t("recorder.recording-status.stt-connected")
        if(status === STATUS_ENUM.STT_SERVER_ERROR) return t("recorder.recording-status.stt-error")
        if(status === STATUS_ENUM.MICROPHONE_CONNETCED) return t("recorder.recording-status.microphone-connected")
        if(status === STATUS_ENUM.MICROPHONE_ERROR) return t("recorder.recording-status.microphone-error")
    }

    const renderSnackBarIcon = ()=>{
        if(status === STATUS_ENUM.STT_SERVER_CONNETCED || status === STATUS_ENUM.STT_SERVER_ERROR ) return <WifiIcon />
        if(status === STATUS_ENUM.MICROPHONE_CONNETCED || status === STATUS_ENUM.MICROPHONE_ERROR) return <MicIcon />
        return <></>
    }
    useEffect(()=>{
        if(state.recorder.status.recording !== true) setStatus("")

        window.addEventListener("onSTTServerConnect" , (data)=>{
            console.log(STATUS_ENUM.STT_SERVER_CONNETCED , data)
            setStatus(STATUS_ENUM.STT_SERVER_CONNETCED)
        })
        window.addEventListener("onSTTServerError" , (data)=>{
            console.log(STATUS_ENUM.STT_SERVER_ERROR , data)
            setStatus(STATUS_ENUM.STT_SERVER_ERROR)
            setTimeout(()=>dispatch({type:"RECORDER_ERROR"}), 1500)
        })
        window.addEventListener("onMicrophonConnect" , (data)=>{
            console.log(STATUS_ENUM.MICROPHONE_CONNETCED , data)
            setStatus(STATUS_ENUM.MICROPHONE_CONNETCED)
        })
        window.addEventListener("onMicrophonError" , (data)=>{
            console.log(STATUS_ENUM.MICROPHONE_ERROR , data)
            setStatus(STATUS_ENUM.MICROPHONE_ERROR)
            setTimeout(()=>dispatch({type:"RECORDER_ERROR"}), 1500)
        })
        return ()=>{
            window.removeEventListener("onSTTServerConnect", ()=> setStatus(""))
            window.removeEventListener("onMicrophonConnect", ()=> setStatus(""))
            window.addEventListener("onSTTServerError" , (data)=> setStatus(""))
            window.addEventListener("onMicrophonError" , (data)=> setStatus(""))
        }
    })
    if(status == "" || state.recorder.status.recording !== true) return <></>
    return (
        <Box sx={{display:"flex", justifyContent:"center"}}>
        <SnackbarContent sx={{width:"15rem"}} className={getSnackBarClassName()} message={
        <React.Fragment>
            <Box sx={{display:"flex", gap:"1rem", alignItems:"center"}}>
                 <div className={classes.snackBarText}>{renderSnackBarMessage()}</div>
                {renderSnackBarIcon()}
            </Box>
           
        </React.Fragment>
        
        } />
        </Box>
    )
}

export default RecordingStatus