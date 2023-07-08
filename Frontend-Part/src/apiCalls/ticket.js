
import axios from "axios";
import base_url from "./apiUtils";

let sendEmailApi = "https://notification-service-m4gi.onrender.com/notificationService/api/v1/sendEmail";

let token = {
    headers: {
        "x-access-token": `${localStorage.getItem("accessToken")}`
    }
}


let getTickets = async (url) => {

    return await axios.get(base_url + url, token)

}

let createTicketsApi = async (url, obj) => {
    
    return await axios.post(base_url + url, obj, token)
}

let updateTicketApi = async (url, obj) => {
    
    return await axios.put(base_url + url, obj, token)
}

let deleteApiCall = async (url) => {
    
    return await axios.delete(base_url + url, token)
}

let assignEngineerToTicket = async (url, obj) => {
    return await axios.put(base_url + url, obj, token)
}

let getEmail = async (url,userId) => {

    return await axios.get(base_url + url+ userId, token)
}

let sendEmail = async (obj) => {
    
    return await axios.post(sendEmailApi, obj, token)
}

export { getTickets, createTicketsApi, updateTicketApi, deleteApiCall,getEmail ,sendEmail,assignEngineerToTicket}





