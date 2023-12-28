import { Box, Divider, Typography } from "@mui/material";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../context/default.context";
import { Theme } from "../../theme/theme";

const RecordingProgress = ()=>{
    const { t } = useTranslation(['translation']);
    const { state, dispatch } = useContext(AppContext);
    if(state.recorder.status.recording == false) return <></>
    return (
        <Box sx={{padding:"1rem"}}>
            <Typography sx={{color:Theme.palette.secondary.main}}>{t("recorder.recording-progress.title")}</Typography>
            <Divider sx={{marginTop:"0.5rem", marginBottom:"0.5rem"}} orientation="horizontal"/>
            {
                state.recorder.status.recording == true ? 
                <Box sx={{display:"flex", gap:"0.5rem"}}>
                    <Typography >{t("recorder.recording-progress.current-stage")}: </Typography>
                    <Typography sx={{color:"rgba(60, 168, 255, 1)"}}>
                        {t(`recorder.recording-progress.current-stage-${state.recorder.status.type}`)}
                        {state.recorder.status.type == "task" ? ` ${state.meeting.clips.filter((task:any)=>task.name == 'task').length + 1}` : ''}
                    </Typography>
                </Box>
                :
                <></>
            }
             <Box sx={{padding:"1rem", overflowY: "auto", maxHeight:"10rem"}}>
            {
                state.meeting.clips.map((clip:any, index:number)=>{
                    return (
                        <Box key={`clip-recording-status-${index}`} sx={{display:"flex", gap:"0.5rem"}}>
                            <Typography sx={{flexBasis:"5rem"}} >{t(`recorder.recording-progress.recorded-success-${clip.name}`)} 
                                {
                                    clip.name == "task" ? ` ${index -1}` : ``
                                }
                                
                            </Typography> 
                            <Typography sx={{color:"rgba(32, 202, 123, 1)"}} >{t(`recorder.recording-progress.status`)}</Typography>
                        </Box>
                    )
                })
            }
            </Box>
        </Box>
    )
}

export default RecordingProgress