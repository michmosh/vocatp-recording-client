import { useContext } from "react";
import { AppContext } from "../../context/default.context";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { Box, Button, Tooltip } from "@mui/material";
import { guiToggleMute } from "../../utils/main";
import React from "react";
import { useTranslation } from "react-i18next";

const MuteButton = ()=>{
    const { t } = useTranslation(['translation']);
    const { state, dispatch } = useContext(AppContext);

    const onMuteMicrophone = ()=>{
        if(state.recorder.status.recording === true){
            const isMute = guiToggleMute()
            if(!isMute) dispatch({type:"RECORDER_UNMUTED"})
            if(isMute) dispatch({type:"RECORDER_MUTED"})
        }
    }

    const renderMicrophoneButton = ()=>{
        if(state.recorder.status.recording === true){
            if(state.recorder.microphoneStatus === 'unmuted'){
                return <MicIcon sx={{color:"rgba(60, 168, 255, 1)"}}/> 
            }
            if(state.recorder.microphoneStatus === 'muted'){
                return <MicOffIcon sx={{color:"rgba(255, 160, 0, 1)"}}/> 
            }
        }
        return <MicIcon sx={{color:"grey"}}/> 
    }

    const renderTolltipText = ()=>{
        if(state.recorder.microphoneStatus === 'muted') return t("recorder.microphone-button.unmute")
        if(state.recorder.microphoneStatus === 'unmuted') return t("recorder.microphone-button.mute")
        return t("recorder.microphone-button.mute")
    }

    return (
        <Tooltip sx={{backgroundColor:"white"}} arrow placement="top" title={
            <React.Fragment>
                <Box sx={{padding:"1rem"}}>{renderTolltipText()}</Box>
            </React.Fragment>
        }>
            <span>
            <Button 
                disabled={state.recorder.status.recording!== true} 
                onClick={onMuteMicrophone} 
                sx={{background :"transparent",width:'4.5rem',height:'3rem', ":hover":{background:"rgb(105 103 103 70%)"}}} 
                variant="outlined">
                {renderMicrophoneButton()}
            </Button>
            </span>
        </Tooltip>
    )
   
}

export default MuteButton