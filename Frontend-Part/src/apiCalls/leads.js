
import axios from "axios";
import base_url from "./apiUtils";

let token = {
    headers: {
        "x-access-token": `${localStorage.getItem("accessToken")}`
    }
}


let postLead =async (obj) => {
    
    return await axios.post(base_url +"/crm/api/v1/leads",obj,token)
}

let getLeads = async () => {
    
    return await axios.get(base_url + "/crm/api/v1/leads",token)
}


export {postLead,getLeads}