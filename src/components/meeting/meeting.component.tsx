import { Box, Button, Card, CardActions, CardContent, Divider, TextField, Typography } from "@mui/material"
import { useContext, useState } from "react"
import { useTranslation } from "react-i18next";
import { AppContext } from "../../context/default.context"
import { Theme } from "../../theme/theme";
import classes from './meeting.module.scss'
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import WorkIcon from '@mui/icons-material/Work';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import {Validator,initialValidationObject} from './validator'
import { Participant } from "../../models/base.model";

const Meeting = ()=>{
    const { state, dispatch } = useContext(AppContext);
    const { t,i18n } = useTranslation(['translation']);
    const navigate = useNavigate();
    const [topic , setTopic] = useState("")
    const [purpose , setPurpose] = useState("")
    const [leader , setLeader] = useState("")
    const [transcriptor , setTranscriptor] = useState("")
    const [newParticipant , setNewParticipant] = useState<Participant>({name: "", position: "",rank:""})
    const [validator , setValidator] = useState(initialValidationObject)
    // console.log("MEETING COMP ->",state)
    const direction = i18n.dir(i18n.language)
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
        // validateFields(value , 'transcriptor')
    }
    const addNewParticipant = (attr:'name'|'email'|'position'|'rank', value:string)=>{
        const participant = {...newParticipant}
        participant[attr] = value
        setNewParticipant({...participant})
        if(attr === 'email') validateFields(value , 'participant-email')
        
    }
    const setMeetingParticipants = ()=>{
        dispatch({type:"ADD_MEETING_RECIPIANTS", payload:newParticipant})
        setNewParticipant({name: "", position: "",rank: ""})
    }

    const isSubmitButtonDisabled = ()=>{
        let isDisabled = true
        if(topic && purpose && leader && transcriptor){
            if(validator.transcriptor.error === false) isDisabled = false 
            if(validator.transcriptor.error === true) isDisabled = true 
        } 
        return isDisabled
    }

    const isAddParticipantButtonDisabled = ()=>{
        const {name,rank,position} = newParticipant;
        let isDisabled = true
        if(name && rank && position){
            isDisabled = false
            if(validator.participnatEmail.error === false) isDisabled = false
            if(validator.participnatEmail.error === true) isDisabled = true
        } 
        return isDisabled
    }

    const createMeeting = ()=>{
        console.log(state.meeting)
        navigate('/recorder')
    }

    const removeRecipient = (recipient:Participant, index:number)=>{
        const recipients = state.meeting.recipients
        recipients.splice(index, 1)
        dispatch({type:"REMOVE_MEETING_RECIPIANTS", payload:recipients})
    }
    const onBlurHandler = (value: string,name: string)=>{
        if(name === 'transcriptor') {
            if(/@idf.iaf.il/.test(value)) setTranscriptor(value)
            else setTranscriptor(`${value}@idf.iaf.il`)
        }
        validateFields(`${value}@idf.iaf.il` , name)
    }

    const validateFields = (value: string,name: string)=>{
        const validateObj = {...validator}
        if(name === 'topic'){
            const valid = Validator.topic.validate(value)
            validateObj.topic = {...validateObj.topic,error:valid?.error, helperText:valid?.helperText}
            setValidator(validateObj)
        }
        if(name === 'transcriptor'){
            const valid = Validator.transcriptor.validate(value)
            validateObj.transcriptor = {...validateObj.transcriptor,error:valid?.error, helperText:valid?.helperText}
            setValidator(validateObj)
        }
        if(name === 'participant-email'){
            const valid = Validator.participnatEmail.validate(value)
            validateObj.participnatEmail = {...validateObj.participnatEmail,error:valid?.error, helperText:valid?.helperText}
            setValidator(validateObj)
        }
        if(name === 'rank'){
            const valid = Validator.transcriptor.validate(value)
            validateObj.rank = {...validateObj.rank,error:valid?.error, helperText:valid?.helperText}
            setValidator(validateObj)
        }
    }
    return (
        <Box sx={{direction:direction, height:"100vh",background:Theme.palette.background.default, display:"flex", justifyContent:"center", alignItems:"center"}}>
            <div className={classes.meeting}>
            <Card className={classes.cardWrapper} sx={{width:"90vw", height:"80vh",overflowY:"auto",padding:"1rem", border:"1px solid #86898A", borderRadius:"4px"}}>
                <CardContent>
                    <Box className={classes.responsiveBox} sx={{display:"grid",gridTemplateColumns:"1fr 2fr" ,direction:direction, gap:"3rem"}}>
                        <div className={classes.rightFormPanelWrapper}>
                            <Typography sx={{ fontSize: '2rem',fontWeight:600 ,color:Theme.palette.text.primary}} color="text.primary" gutterBottom>
                                {t('meeting.createTitle')}
                            </Typography>
                            <TextField sx={{paddingTop:"1rem"}} 
                                helperText={validator.topic.helperText} 
                                error={validator.topic.error} 
                                onBlur={(e)=>onBlurHandler(e.target.value , 'topic')} 
                                required 
                                value={topic} 
                                onChange={(e)=>setMeetingTopic(e.target.value)} 
                                className={classes.inputText} 
                                fullWidth 
                                id="meeting-topic" 
                                label={t("meeting.labels.topic")} 
                                variant="filled" />
                            <TextField sx={{paddingTop:"1rem"}} required value={purpose} onChange={(e)=>setMeetingPorpuse(e.target.value)} className={classes.inputText} fullWidth id="meeting-purpose" label={t("meeting.labels.purpose")} variant="filled" />
                            <TextField sx={{paddingTop:"1rem"}} required value={leader} onChange={(e)=>setMeetingLeader(e.target.value)} className={classes.inputText} fullWidth id="meeting-leader" label={t("meeting.labels.leader")} variant="filled" />
                            <TextField sx={{paddingTop:"1rem"}} 
                                helperText={validator.transcriptor.helperText} 
                                error={validator.transcriptor.error} 
                                onBlur={(e)=>onBlurHandler(e.target.value , 'transcriptor')} 
                                required 
                                value={transcriptor} 
                                onChange={(e)=>setMeetingTranscriptor(e.target.value)} 
                                className={classes.inputText} 
                                fullWidth 
                                id="meeting-transcriptor" 
                                label={t("meeting.labels.transcriptor")} 
                                variant="filled" />
                        </div>
                        <div className={classes.leftFormPanelWrapper}>
                            <Typography className={classes.title}  sx={{ fontSize: '1rem',fontWeight:600 ,color:'rgba(142, 142, 169, 1)'}} color="text.primary" gutterBottom>
                                {t('meeting.add-participants-tite')}
                            </Typography>
                            <Box sx={{display:"flex", width:'100%', gap:"1rem"}} className={classes.newParticipantInputWrapper}>
                                <Box sx={{display:"block", flexBasis:"90%"}} className={classes.newParticipantInputWrapper}>
                                    <div className={classes.newParticipantInput}>
                                        <TextField sx={{paddingTop:"1rem", flexBasis:"30%"}} value={newParticipant.name} onChange={(e)=>addNewParticipant('name',e.target.value)} className={classes.inputText} id="meeting-topic" label={t("meeting.labels.new-participant.name")} variant="filled" />
                                        <TextField sx={{paddingTop:"1rem", flexBasis:"30%"}} value={newParticipant.position} onChange={(e)=>addNewParticipant('position',e.target.value)} className={classes.inputText} id="meeting-topic" label={t("meeting.labels.new-participant.position")} variant="filled" />
                                        <TextField 
                                            sx={{paddingTop:"1rem", flexBasis:"30%"}} 
                                            helperText={validator.participnatEmail.helperText} 
                                            error={validator.participnatEmail.error}  
                                            value={newParticipant.email} 
                                            onBlur={(e)=>onBlurHandler(e.target.value , 'rank')}  
                                            onChange={(e)=>addNewParticipant('rank',e.target.value)} 
                                            className={classes.inputText} 
                                            id="meeting-topic" 
                                            label={t("meeting.labels.new-participant.rank")} 
                                            variant="filled" />
                                    </div>
                                </Box>
                                <Box sx={{paddingTop:"1rem"}}>
                                    <Button disabled={isAddParticipantButtonDisabled()} className={classes.addParticipantButton} sx={{background:"rgba(33, 150, 243, 1)"}} onClick={setMeetingParticipants}  variant="contained">
                                        <AddIcon/>
                                    </Button>
                                </Box>
                            </Box>
                           
                            <div className={classes.participantsList}>
                                {
                                   state.meeting.recipients.map((item:any, index:number)=>{
                                        return (
                                            <div key={`participant-${index}`} className={classes.participantsListItem}>
                                                <div className={classes.participantsListItemContent}> 
                                                    <PersonIcon /> 
                                                    <div>{item.name}</div> 
                                                    <Divider sx={{justifySelf:"flex-end"}} orientation="vertical"/>
                                                </div> 
                                                
                                                <div className={classes.participantsListItemContent}> 
                                                    <MilitaryTechIcon /> 
                                                    <div>{item.rank}</div> 
                                                    <Divider sx={{justifySelf:"flex-end"}} orientation="vertical"/>
                                                </div> 
                                                
                                                <div className={classes.participantsListItemContent}> 
                                                    <WorkIcon /> 
                                                    <div>{item.position}</div> 
                                                </div> 
                                                <Button variant="outlined" onClick={()=>removeRecipient(item,index)} sx={{background :"rgba(240, 86, 86, 1)", ":hover":{background:"rgba(240, 86, 86, 0.7)"}}}> 
                                                    <DeleteIcon /> 
                                                </Button> 
                                            </div>
                                        )
                                   })
                                }
                            </div>
                        </div>
                    </Box>
                </CardContent>
                <CardActions sx={{justifyContent:"end"}}>
                    <Button disabled={isSubmitButtonDisabled()} onClick={createMeeting} variant="contained" >{t("meeting.create-meeting")}</Button>
                </CardActions>
            </Card>
            </div>
        </Box>
    )
}

export default Meeting
