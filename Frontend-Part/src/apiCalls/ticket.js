
import axios from "axios";
import base_url from "./apiUtils";

let sendEmailApi = "https://notification-service-m4gi.onrender.com/notificationService/api/v1/sendEmail";

let token = {
    headers: {
        "x-access-token": `${localStorage.getItem("accessToken")}`
    }
}


let getTickets = async () => {

    return await axios.get(base_url + "/crm/api/v1/tickets", token)

}

let createTicketsApi = async (obj) => {
    
    return await axios.post(base_url + "/crm/api/v1/tickets", obj, token)
}

let updateTicketApi = async (id, obj) => {
    
    return await axios.put(base_url + "/crm/api/v1/tickets/"+id, obj, token)
}

let deleteApiCall = async (id) => {
    
    return await axios.delete(base_url + "/crm/api/v1/tickets/"+ id, token)
}

let assignEngineerToTicket = async ( obj) => {
    return await axios.put(base_url + "/crm/api/v1/assignTickets", obj, token)
}

let getEmail = async (userId) => {

    return await axios.get(base_url + "/crm/api/v1/getEmail/" + userId, token)
}

let sendEmail = async (obj) => {
    
    return await axios.post(sendEmailApi, obj, token)
}

export { getTickets, createTicketsApi, updateTicketApi, deleteApiCall,getEmail ,sendEmail,assignEngineerToTicket}





