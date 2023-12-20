export interface Participant {
    name:string;
    position:string;
    email:string;
}
export interface Clip {
    start:number;
    end:number;
    name:string
}
export interface Meeting{
    meeting:{
        id:string,
        topic:string,
        leader:string,
        date:string,
        purpose: string,
        transcriptor: string,
        recipients:Participant[],
        clips:Clip[],
        rawStt:[]
    },
    recorder:{
        test:string,
        status:{
            recording:boolean,
            type:string
        },
        microphoneStatus:string
    }
}