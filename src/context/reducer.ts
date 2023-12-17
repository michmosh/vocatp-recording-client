export const defaultReducer = (state: any , action: any)=>{
    const { type, payload } = action

    switch(type){
        case "TEST":{
            console.log("TEST", payload)
            return {...state}
        }
        case "CHANGE_MEETING_TOPIC":{
            console.log("CHANGE_MEETING_TOPIC: ", payload)
            return {
                meeting : {
                   ...state.meeting ,
                   topic:payload
                },
                recorder:{ ...state.recorder}
            }
        }
        case "CHANGE_MEETING_PURPOSE":{
            console.log("CHANGE_MEETING_PURPOSE: ", payload)
            return {
                meeting : {
                   ...state.meeting ,
                   purpose:payload
                },
                recorder:{...state.recorder}
            }
        }
        case "CHANGE_MEETING_LEADER":{
            console.log("CHANGE_MEETING_LEADER: ", payload)
            return {
                meeting : {
                   ...state.meeting ,
                   leader:payload
                },
                recorder:{ ...state.recorder}
            }
        }
        case "CHANGE_MEETING_TRANSCRIPTOR":{
            console.log("CHANGE_MEETING_TRANSCRIPTOR: ", payload)
            return {
                meeting : {
                   ...state.meeting ,
                   transcriptor:payload
                },
                recorder:{ ...state.recorder}
            }
        }
        case "CHANGE_MEETING_DATE":{
            console.log("CHANGE_MEETING_DATE: ", payload)
            return {
                meeting : {
                   ...state.meeting ,
                   date:payload
                },
                recorder:{ ...state.recorder}
            }
        }
        case "ADD_MEETING_RECIPIANTS":{
            console.log("ADD_MEETING_RECIPIANTS: ", payload)
            return {
                meeting : {
                   ...state.meeting ,
                   recipients:[...state.meeting.recipients , payload]
                },
                recorder:{...state.recorder}
            }
        }
        case "START_RECORDING":{
            console.log("START_RECORDING: ", payload)
            return {
                meeting : {...state.meeting },
                recorder:{...state.recorder, status:{recording : payload.status, type:payload.type}}
            }
        }
        case "START_INTRODUCTION":{
            console.log("START_INTRODUCTION: ", payload)
            return {
                meeting : {...state.meeting, clips:[...state.meeting.clips] },
                recorder:{...state.recorder, status:{...payload.status}}
            }
        }
        case "START_SUMMARY":{
            console.log("START_SUMMARY: ", payload)
            return {
                meeting : {...state.meeting, clips:[...payload.clips] },
                recorder:{...state.recorder,  status:{...payload.status}}
            }
        }
        case "START_TASK":{
            console.log("START_TASK: ", payload)
            return {
                meeting : {...state.meeting, clips:[...payload.clips] },
                recorder:{...state.recorder,  status:{...payload.status}}
            }
        }
        case "STOP_RECORDING":{
            console.log("STOP_RECORDING: ", payload)
            return {
                meeting : {...state.meeting},
                recorder:{...state.recorder, status:{...payload.status}}
            }
        }

        default: throw new Error(`No case for type ${type} found in Default Reducer.`);
    }
}