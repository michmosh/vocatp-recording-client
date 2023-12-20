import React, { createContext, useReducer } from 'react';
import { Meeting } from '../models/base.model';
import { defaultReducer } from './reducer';

export const DefaultContext: Meeting = {
    meeting:{
        id:"",
        topic:"",
        leader:"",
        date:"",
        purpose: "",
        transcriptor: "",
        recipients:[],
        clips:[],
        rawStt:[]
    },
    recorder:{
        test:"",
        status:{
            recording:false,
            type:"introduction"
        },
        microphoneStatus:""
    }
}
const dispatch: React.Dispatch<any> = () => null
export const AppContext = createContext({state: DefaultContext, dispatch:dispatch});

export const AppProvider: React.FC<any> = ({children})=>{
    const [state, dispatch] = useReducer(defaultReducer, DefaultContext);
    return (
        <AppContext.Provider value={{state, dispatch}}>
            {children}
        </AppContext.Provider>
    )
}


