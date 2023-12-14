import { Box, Button, Card, CardActions, CardContent, IconButton, TextField, Typography } from "@mui/material"
import { height } from "@mui/system";
import { useContext, useState } from "react"
import { useTranslation } from "react-i18next";
import { AppContext } from "../../context/default.context"
import { Theme } from "../../theme/theme";
import classes from './meeting.module.scss'
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from "react-router-dom";

const Meeting = ()=>{
    const { state, dispatch } = useContext(AppContext);
    const { t } = useTranslation(['translation']);
    const navigate = useNavigate();
    const [topic , setTopic] = useState("")
    const [purpose , setPurpose] = useState("")
    const [leader , setLeader] = useState("")
    const [transcriptor , setTranscriptor] = useState("")
    const [newParticipant , setNewParticipant] = useState({name: "", position: "",email: ""})
    // console.log("MEETING COMP ->",state)

    const setMeetingTopic = (value: string)=>{
        setTopic(value)
        dispatch({type:"CHANGE_MEETING_TOPIC", payload:value})
    }
    const setMeetingPorpuse = (value: string)=>{
        setPurpose(value)
        dispatch({type:"CHANGE_MEETING_PURPOSE", payload:value})
    }
    const setMeetingLeader = (value: string)=>{
        setLeader(value)
        dispatch({type:"CHANGE_MEETING_LEADER", payload:value})
    }
    const setMeetingTranscriptor = (value: string)=>{
        setTranscriptor(value)
        dispatch({type:"CHANGE_MEETING_TRANSCRIPTOR", payload:value})
    }
    const addNewParticipant = (attr:'name'|'email'|'position', value:string)=>{
        const participant = {...newParticipant}
        participant[attr] = value
        setNewParticipant({...participant})
    }
    const setMeetingParticipants = ()=>{
        dispatch({type:"ADD_MEETING_RECIPIANTS", payload:newParticipant})
    }

    const createMeeting = ()=>{
        console.log(state.meeting)
        navigate('/recorder')
    }
    return (
        <Box sx={{direction:Theme.direction, height:"100vh",background:Theme.palette.background.default, display:"flex", justifyContent:"center", alignItems:"center"}}>
            <div className="meeting">
            <Card sx={{width:"70vw", height:"70vh",padding:"1rem", border:"1px solid #86898A", borderRadius:"4px"}}>
                <CardContent>
                    <Box sx={{display:"grid",gridTemplateColumns:"1fr 1fr" ,direction:Theme.direction, gap:"3rem"}}>
                        <div className={classes.rightFormPanelWrapper}>
                            <Typography sx={{ fontSize: '2rem',fontWeight:600 ,color:Theme.palette.text.primary}} color="text.primary" gutterBottom>
                                {t('meeting.createTitle')}
                            </Typography>
                            <TextField sx={{paddingTop:"1rem"}} value={topic} onChange={(e)=>setMeetingTopic(e.target.value)} className={classes.inputText} fullWidth id="meeting-topic" label={t("meeting.labels.topic")} variant="filled" />
                            <TextField sx={{paddingTop:"1rem"}} value={purpose} onChange={(e)=>setMeetingPorpuse(e.target.value)} className={classes.inputText} fullWidth id="meeting-purpose" label={t("meeting.labels.purpose")} variant="filled" />
                            <TextField sx={{paddingTop:"1rem"}} value={leader} onChange={(e)=>setMeetingLeader(e.target.value)} className={classes.inputText} fullWidth id="meeting-leader" label={t("meeting.labels.leader")} variant="filled" />
                            <TextField sx={{paddingTop:"1rem"}} value={transcriptor} onChange={(e)=>setMeetingTranscriptor(e.target.value)} className={classes.inputText} fullWidth id="meeting-transcriptor" label={t("meeting.labels.transcriptor")} variant="filled" />
                        </div>
                        <div className={classes.leftFormPanelWrapper}>
                            <Typography className={classes.title}  sx={{ fontSize: '1rem',fontWeight:600 ,color:'rgba(142, 142, 169, 1)'}} color="text.primary" gutterBottom>
                                {t('meeting.add-participants-tite')}
                            </Typography>
                            <div className={classes.newParticipantInput}>
                                <TextField sx={{paddingTop:"1rem"}} value={newParticipant.name} onChange={(e)=>addNewParticipant('name',e.target.value)} className={classes.inputText} id="meeting-topic" label={t("meeting.labels.new-participant.name")} variant="outlined" />
                                <TextField sx={{paddingTop:"1rem"}} value={newParticipant.email} onChange={(e)=>addNewParticipant('email',e.target.value)} className={classes.inputText} id="meeting-topic" label={t("meeting.labels.new-participant.email")} variant="outlined" />
                                <TextField sx={{paddingTop:"1rem"}} value={newParticipant.position} onChange={(e)=>addNewParticipant('position',e.target.value)} className={classes.inputText} id="meeting-topic" label={t("meeting.labels.new-participant.position")} variant="outlined" />
                                <Button className={classes.addParticipantButton} sx={{color:Theme.palette.text.primary,background:"rgba(33, 150, 243, 1)"}} onClick={setMeetingParticipants} variant="contained">
                                    <AddIcon/>
                                </Button>
                               
                            </div>
                            <div className={classes.participantsList}>
                                {
                                   state.meeting.recipients.map((item:any, index:number)=>{
                                        return (
                                            <div key={`participant-${index}`} className={classes.participantsListItem}>
                                                <div className={classes.participantsListItemContent}> 
                                                    <PersonIcon /> 
                                                    <div>{item.name}</div> 
                                                </div> 
                                                <div className={classes.participantsListItemContent}> 
                                                    <MailIcon /> 
                                                    <div>{item.email}</div> 
                                                </div> 
                                                <div className={classes.participantsListItemContent}> 
                                                    <WorkIcon /> 
                                                    <div>{item.position}</div> 
                                                </div> 
                                            </div>
                                        )
                                   })
 
                                }
                               
                            </div>
                        </div>
                       
                    </Box>
                   
                </CardContent>
                <CardActions sx={{justifyContent:"end"}}>
                    <Button onClick={createMeeting} variant="contained" >{t("meeting.create-meeting")}</Button>
                </CardActions>
            </Card>
            </div>
        </Box>
    )
}

export default Meeting
