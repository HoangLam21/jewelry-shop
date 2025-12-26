import { ScheduleRequest } from "@/dto/ScheduleDTO";

export const fetchSchedule = async ()=>{
    try{   
        const schedules = await fetch("/api/schedule/all");
        return await schedules.json();
    }catch(error){
        console.log(error);
        throw error;
    }
}

export const createSchedule = async (params:ScheduleRequest)=>{
    try{   
        const createdSchedule = await fetch('/api/schedule/create',{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
        
            },
            body: JSON.stringify(params),
          })
        if(createdSchedule){
            return await createdSchedule.json();
        }
    }catch(error){
        console.log(error);
        throw error;
    }
}

export const editSchedule = async (id:string, params:ScheduleRequest)=>{
    try{
        const editedSchedule = await fetch(`/api/schedule/update?id=${id}`,{
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
        
            },
            body: JSON.stringify(params),
          })
        if(editedSchedule){
            return await editedSchedule.json();
        }
    }catch(error){
        console.log(error);
        throw error;
    }
}

export const deleteSchedule = async (id:string)=>{
    try{
        const result = await fetch(`/api/schedule/delete?id=${id}`,{
            method:"DELETE",
            headers: {
                "Content-Type": "application/json",
          
              },
        })
        return result;
    }catch(error){
        console.log(error);
        throw error;
    }
}