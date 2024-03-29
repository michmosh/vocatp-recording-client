import { Box, Card, CardContent, Typography, Chip, Button, Radio, Divider } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../context/default.context";
import { Theme } from "../../theme/theme";
import classes from './recorder.module.scss'
import AddIcon from '@mui/icons-material/Add';
import {guiStart, guiStop, saveClip} from '../../utils/main'
import Moment from 'react-moment';
import Dialog from "@mui/material/Dialog";
import EndRecordDialog from "../end-record-dialog/end-record-dialog.component";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import RecordingProgress from "../recording-progress/recording-progress.component";
import CustomTooltip from "../custom-tooltip/custom-tooltip.component";
import React from "react";
import MuteButton from "../mute-button/mute-button.component";
import { Clip } from "../../models/base.model";

import { PushNotification } from "../../utils/notifications";
const Recorder = ()=>{
    const { t,i18n } = useTranslation(['translation']);
    const { state, dispatch } = useContext(AppContext);
    const navigate = useNavigate();
    const [recordingStart , setRecordingStart] = useState(false)
    const [recordingStartTime , setRecordingStartTime] = useState(new Date().toISOString())
    const [showRecordingEndDialog , setShowRecordingEndDialog] = useState(false)
    const [meetingDuration , setMeetingDuration] = useState(0);
    const [participantsIndex , setParticipantsIndex] = useState(10);
    const [isNotificationShown , setIsNotificationShown] = useState(false)
    const [notificationObject , setNotificationObject] = useState<Notification|null>(null)
    // console.log("RECORDER COMP -> ", state)
    const direction = i18n.dir(i18n.language)

    const startRecording = async ()=>{
        const meeting = state.meeting
        meeting.date = new Date().toLocaleDateString('he-il')
        guiStart(meeting)
        //@ts-ignore
        const type = window.BASE_CONFIG.useClips === true ? "introduction" : ''
        dispatch({type:"START_INTRODUCTION", payload:{status:{recording:true , type:type}}})
        sendNotification()
    }
    const stopRecording = ()=>{
         //@ts-ignore
        if(window.BASE_CONFIG.useClips !== true){
            guiStop('')
            dispatch({type:"STOP_RECORDING", payload:{status:{recording:false , type:"introduction"}}})
            removeNotification()
            return
        } 
        const taskClip = state.meeting.clips.find((clip:Clip)=>clip.name === "task");
        if(taskClip) guiStop("task")
        if(!taskClip) guiStop("summary")
        dispatch({type:"STOP_RECORDING", payload:{status:{recording:false , type:"introduction"}}})
        removeNotification()    
    }
    const saveIntroAndstartRecordingSummary = ()=>{
        const clips:Clip[] = saveClip("introduction")
        console.log("SAVE INTRO -> "  , clips)
        dispatch({type:"START_SUMMARY", payload:{status:{recording:true , type:"summary"},clips: clips}})
    }
    const saveSummaryAndstartRecordingTask = ()=>{
        const clips:Clip[] = saveClip("summary")
        console.log("SAVE SUMMARY -> " , clips)
        dispatch({type:"START_TASK", payload:{status:{recording:true , type:"task"}, clips:clips}})
    }
    const saveTaskandstartRecordingTask = ()=>{
        const clips:Clip[] = saveClip("task")
        console.log("SAVE TASK -> "  , clips)
        dispatch({type:"START_TASK", payload:{status:{recording:true , type:"task"}, clips:clips}})
    }

    const sendNotification = async ()=>{
        if(!isNotificationShown){
            const notification = await PushNotification.sendNotification() as Notification
            setIsNotificationShown(true)
            setNotificationObject(notification)
        }
    }
    const removeNotification = ()=>{
        setIsNotificationShown(false)
        if(notificationObject !== null) notificationObject.close()
    }
    const renderClipsButton = ()=>{
        if(state.recorder.status.recording !== true) return <></>
        // console.log("RECORDING TYPE -> ", state.recorder.status)
        if(state.recorder.status.type === "introduction"){
            return (
                <Button onClick={saveIntroAndstartRecordingSummary} sx={{background :"transparent", ":hover":{background:"rgb(105 103 103 70%)"}}} variant="outlined">
                    <AddIcon sx={{paddingLeft:"0.5rem"}}/>
                    {t("recorder.recording-summary")}
                </Button>
            )
        }
        if(state.recorder.status.type === "summary"){
            return (
                <Button onClick={saveSummaryAndstartRecordingTask} sx={{background :"transparent", ":hover":{background:"rgb(105 103 103 70%)"}}} variant="outlined">
                    <AddIcon sx={{paddingLeft:"0.5rem"}}/>
                    {t("recorder.recording-task")+ ` 1`}
                </Button>
            )
        }
        if(state.recorder.status.type === "task"){
            return (
                <Button  onClick={saveTaskandstartRecordingTask} sx={{background :"transparent", ":hover":{background:"rgb(105 103 103 70%)"}}} variant="outlined">
                    <AddIcon sx={{paddingLeft:"0.5rem"}}/>
                    {t("recorder.recording-task") + ` ${state.meeting.clips.filter((clip: any)=>clip.name === "task").length +2}`}
                </Button>
            )
        }
        return <></>
    }
    const handleCloseDialog = ()=>{
       setShowRecordingEndDialog(false)
       dispatch({type:"END_MEETING"})
       navigate('/meeting')
    }
    const calculateMeetingDuration = ()=>{
        const now = moment(new Date())
        const seconds = moment.duration(now.diff(recordingStartTime)).asSeconds()
       setMeetingDuration(seconds)
    }

    const showAllParticipants = ()=>{
        if(participantsIndex === 10 ) setParticipantsIndex(100)
        if(participantsIndex > 10 ) setParticipantsIndex(10)
    }
    
    useEffect(()=>{
        window.addEventListener("onRecordingStart" , (data)=>{
            console.log("IN EVENT GUI START " , data)
            setRecordingStart(true)
            setRecordingStartTime(new Date().toISOString())
        })
        window.addEventListener("onRecordingEnd" , (data)=>{
            console.log("IN EVENT GUI END " , data)
            calculateMeetingDuration()
            setRecordingStart(false)
            setRecordingStartTime(new Date().toISOString())
            setShowRecordingEndDialog(true)
        })
        return()=>{
            window.removeEventListener("onRecordingStart", ()=>{
                setRecordingStart(false)
                setRecordingStartTime(new Date().toISOString())
            })
            window.removeEventListener("onRecordingEnd", ()=>{
                setRecordingStart(false)
                setRecordingStartTime(new Date().toISOString())
            })
        } 
    })
    return (
        <Box className={classes.wrapperBox} sx={{direction:direction, minHeight:"100vh",background:Theme.palette.background.default, display:"flex", justifyContent:"center", alignItems:"center"}}>
        <div className="recorder">
            <Card sx={{backgroundColor:Theme.palette.background.paper,width:"70vw", padding:"1rem"}}>
            <CardContent sx={{padding:"4rem"}}>
                <Typography className={classes.title}  sx={{ fontSize: '1rem',fontWeight:600 ,color:'rgba(142, 142, 169, 1)'}} color="text.primary" gutterBottom>
                    {t('recorder.title')}
                </Typography>
                <Box sx={{direction:direction, gap:"3rem", paddingBottom:'3rem'}}>
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
                        <div className={classes.meetingDataItemParticipantsWrapper}>
                            <span style={{color:Theme.palette.secondary.main}}>{t("recorder.labels.participants")} : </span>
                            <div className={classes.meetingDataItemParticipants}>
                                {state.meeting.recipients.map((item:any , index:number)=>{
                                    if(index < participantsIndex){
                                        return (
                                            <div className={classes.participantChip} key={`participant-${index}`}>
                                                <CustomTooltip sx={{flexBasis:"10%"}} placement="top" title="test" data={item}>
                                                    <Chip label={item.name}/>
                                                </CustomTooltip>
                                            </div>
                                            
                                        )
                                    }
                                })}
                                {
                                    state.meeting.recipients.length > 10 ?
                                    <Button onClick={showAllParticipants} variant="text">
                                        {
                                            participantsIndex === 10 ? 
                                            t("recorder.participants-show.show-more") : 
                                            t("recorder.participants-show.show-less")
                                        }
                                    </Button>
                                    :
                                    <></>
                                }
                            </div>
                        </div>
                    </div>
                    
                </Box>
                <Box sx={{backgroundColor: Theme.palette.background.paper, padding:'2rem', display:"flex", justifyContent:"space-evenly", alignItems:"center"}}>
                    {
                    state.recorder.status.recording == false ? 
                    <Button variant="outlined" onClick={startRecording} sx={{background :"rgba(240, 86, 86, 1)",flexDirection:"column" ,width:'10.5rem',height:'10.5rem',borderRadius:"50%" ,":hover":{background:"rgba(240, 86, 86, 0.7)"}}}>
                        <Radio
                            checked={true}
                            value="a"
                            name="radio-buttons"
                            inputProps={{ 'aria-label': 'A' }}
                        />
                        {t("recorder.start-record-button")}
                        
                    </Button>
                    :
                    <Button variant="outlined" onClick={stopRecording} sx={{background :"rgba(240, 86, 86, 1)",flexDirection:"column",width:'10.5rem',height:'10.5rem',borderRadius:"50%", ":hover":{background:"rgba(240, 86, 86, 0.7)"}}}>
                        <Radio
                            checked={true}
                            value="a"
                            name="radio-buttons"
                            inputProps={{ 'aria-label': 'A' }}
                        />
                        {t("recorder.stop-record-button")}
                        
                    </Button>
                }
                    
                   
                    {
                        recordingStart ? 
                        <Moment className={classes.momentTime} interval={1000} date={recordingStartTime} durationFromNow format="hh:mm:ss"/>
                        :
                        <Chip sx={{fontSize:"2em",padding:"2rem", background:"transparent" , border:"1px solid grey"}} label={"00:00:00"}/>
                    }
                    <Divider orientation="vertical" flexItem />
                    <MuteButton/>
                    {
                        //@ts-ignore
                        window.BASE_CONFIG.useClips === true?
                        renderClipsButton()
                        :
                        <></>
                    }
                    {/* <Button onClick={()=>setShowRecordingEndDialog(true)}> open</Button> */}
                </Box>
                {
                    //@ts-ignore
                    window.BASE_CONFIG.useClips === true?
                    <RecordingProgress />:
                    <></>
                }
                
            </CardContent>
            </Card>
           
        </div>
            <Dialog fullWidth maxWidth="sm" open={showRecordingEndDialog}  onClose={handleCloseDialog}>
                <EndRecordDialog startTime={recordingStartTime} duration={meetingDuration} onClose={handleCloseDialog}/>
            </Dialog>
    </Box>
    )
}

export default Recorder