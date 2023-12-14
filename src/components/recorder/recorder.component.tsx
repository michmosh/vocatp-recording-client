import { Box, Card, CardContent, Typography, Chip, Button, Radio, Divider, IconButton } from "@mui/material";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../context/default.context";
import { Theme } from "../../theme/theme";
import classes from './recorder.module.scss'
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import AddIcon from '@mui/icons-material/Add';
import {guiStart, guiStop} from '../../utils/main'
const Recorder = ()=>{
    const { t } = useTranslation(['translation']);
    const { state, dispatch } = useContext(AppContext);
    console.log("RECORDER COMP -> ", state)

    const startRecording = ()=>{
        guiStart(state.meeting)
        dispatch({type:"START_RECORDING", payload:true})
    }
    const stopRecording = ()=>{
        guiStop()
        dispatch({type:"STOP_RECORDING", payload:false})
    }
    return (
        <Box sx={{direction:Theme.direction, height:"100vh",background:Theme.palette.background.default, display:"flex", justifyContent:"center", alignItems:"center"}}>
        <div className="recorder">
            <Card sx={{backgroundColor:Theme.palette.background.default,width:"70vw", height:"70vh",padding:"1rem"}}>
            <CardContent sx={{padding:"4rem"}}>
                <Typography className={classes.title}  sx={{ fontSize: '1rem',fontWeight:600 ,color:'rgba(142, 142, 169, 1)'}} color="text.primary" gutterBottom>
                    {t('recorder.title')}
                </Typography>
                <Box sx={{direction:Theme.direction, gap:"3rem", paddingBottom:'3rem'}}>
                    <div className={classes.meetingData}>
                        <div className={classes.meetingDataItem}>
                            <span style={{color:Theme.palette.secondary.main}}>{t("recorder.labels.topic")} : </span>
                            <span>{state.meeting.topic}</span>
                        </div>
                        <div className={classes.meetingDataItem}>
                            <span style={{color:Theme.palette.secondary.main}}>{t("recorder.labels.purpose")} : </span>
                            <span>{state.meeting.purpose}</span>
                        </div>
                    </div>
                    <div className={classes.meetingData}>
                        <div className={classes.meetingDataItem}>
                            <span style={{color:Theme.palette.secondary.main}}>{t("recorder.labels.leader")} : </span>
                            <span>{state.meeting.leader}</span>
                        </div>
                        <div className={classes.meetingDataItem}>
                            <span style={{color:Theme.palette.secondary.main}}>{t("recorder.labels.participants")} : </span>
                            <div className={classes.meetingDataItemParticipants}>
                                {state.meeting.recipients.map((item:any , index:number)=>{
                                    return (
                                        <div className={classes.meetingDataItemParticipants} key={`participant-${index}`}>
                                            <Chip label={item.name}/>
                                        </div>
                                        
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    
                </Box>
                <Box sx={{backgroundColor: Theme.palette.background.paper, padding:'2rem', display:"flex", justifyContent:"space-evenly", alignItems:"center"}}>
                    {
                    state.recorder.status.recording == false ? 
                    <Button onClick={startRecording} sx={{background :"rgba(240, 86, 86, 1)", ":hover":{background:"rgba(240, 86, 86, 0.7)"}}}>
                        <Radio
                            checked={true}
                            value="a"
                            name="radio-buttons"
                            inputProps={{ 'aria-label': 'A' }}
                        />
                        {t("recorder.start-record-button")}
                        
                    </Button>
                    :
                    <Button onClick={stopRecording} sx={{background :"rgba(240, 86, 86, 1)", ":hover":{background:"rgba(240, 86, 86, 0.7)"}}}>
                        <Radio
                            checked={true}
                            value="a"
                            name="radio-buttons"
                            inputProps={{ 'aria-label': 'A' }}
                        />
                        {t("recorder.stop-record-button")}
                        
                    </Button>
                }
                    
                    <Chip sx={{padding:"1rem", background:"transparent" , border:"1px solid grey"}} label={"00:35:25"}/>
                    <Divider orientation="vertical" flexItem />
                    <Button sx={{background :"transparent", ":hover":{background:"rgb(105 103 103 70%)"}}} variant="outlined">
                       <MicIcon /> 
                    </Button>
                    <Button sx={{background :"transparent", ":hover":{background:"rgb(105 103 103 70%)"}}} variant="outlined">
                       <AddIcon sx={{paddingLeft:"0.5rem"}}/>
                       {t("recorder.recording-summary")}
                    </Button>
                </Box>
            </CardContent>
            </Card>
           
        </div>
    </Box>
    )
}

export default Recorder