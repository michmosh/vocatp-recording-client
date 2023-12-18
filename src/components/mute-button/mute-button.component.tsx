import { useContext } from "react";
import { AppContext } from "../../context/default.context";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { Button } from "@mui/material";
import { guiToggleMute } from "../../utils/main";

const MuteButton = ()=>{
    const { state, dispatch } = useContext(AppContext);

    const onMuteMicrophone = ()=>{
        if(state.recorder.status.recording == true){
            const isMute = guiToggleMute()
            if(!isMute) dispatch({type:"RECORDER_UNMUTED"})
            if(isMute) dispatch({type:"RECORDER_MUTED"})
        }
       
    }

    const renderMicrophoneButton = ()=>{
        if(state.recorder.microphoneStatus == 'unmuted'){
            return (
                <MicIcon sx={{color:"rgba(60, 168, 255, 1)"}}/> 
            )
        }
        if(state.recorder.microphoneStatus == 'muted'){
            return (
                <MicOffIcon sx={{color:"rgba(255, 160, 0, 1)"}}/> 
            )
        }
        return <MicIcon /> 
    }
    return (
        <Button onClick={onMuteMicrophone} sx={{background :"transparent", ":hover":{background:"rgb(105 103 103 70%)"}}} variant="outlined">
            {renderMicrophoneButton()}
        </Button>
    )
   
}

export default MuteButton