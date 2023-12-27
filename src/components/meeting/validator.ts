export const initialValidationObject = {
    topic:{
        error:false,
        required: true,
        helperText:''
    },
    transcriptor:{
        error:false,
        required: true,
        helperText:'',
        emailField:true
    },
    participnatEmail:{
        error:false,
        required: false,
        helperText:'',
        emailField:true
    }
}
interface ValidationResponse{
    error?:boolean;
    helperText?: string;
}
export const Validator = {
    topic:{
        error:false,
        required: true,
        helperText:'This field is required',
        validate:<ValidationResponse> (value:string)=>{
            let validatorResponse = {error: true, helperText:''}
            if(Validator.topic.required){
                if(value !== "") validatorResponse =  {error: false , helperText: ''}
                if(value == "") validatorResponse =  {error: true , helperText: Validator.topic.helperText}
            }
            return validatorResponse
        }
    },
    transcriptor:{
        error:false,
        required: true,
        helperText:'Please provide a valid email',
        emailField:true,
        validate:<ValidationResponse> (value:string)=>{
            let validatorResponse = {error: true, helperText:''}
            if(Validator.topic.required){
                if(value !== "") validatorResponse =  {error: false , helperText: ''}
                if(value == "") validatorResponse =  {error: true , helperText: Validator.topic.helperText}
            }
            if(Validator.transcriptor.emailField == true){
                if(/^[a-zA-Z]+[a-zA-Z0-9_.]+@[a-zA-Z.]+[a-zA-Z]$/.test(value) == false){
                    validatorResponse =  {error: true , helperText: Validator.transcriptor.helperText}
                }
            }
            return validatorResponse
        }
    },
    participnatEmail:{
        error:false,
        required: false,
        helperText:'Please provide a valid email',
        emailField:true,
        validate:<ValidationResponse> (value:string)=>{
            let validatorResponse = {error: true, helperText:''}
            if(Validator.topic.required){
                if(value !== "") validatorResponse =  {error: false , helperText: ''}
                if(value == "") validatorResponse =  {error: true , helperText: Validator.topic.helperText}
            }
            if(Validator.transcriptor.emailField == true){
                if(/^[a-zA-Z]+[a-zA-Z0-9_.]+@[a-zA-Z.]+[a-zA-Z]$/.test(value) == false){
                    validatorResponse =  {error: true , helperText: Validator.transcriptor.helperText}
                }
            }
            return validatorResponse
        }
    }
}