
import axios from "axios";
import base_url from "./apiUtils";


let getTickets = async (url) => {

    return await axios.get(base_url + url, {
        headers: {
            "x-access-token": `${localStorage.getItem("accessToken")}`
        }
    })

}

let createTicketsApi = async (url, obj) => {
    
    return await axios.post(base_url + url, obj, {
        headers: {
            "x-access-token": `${localStorage.getItem("accessToken")}`
        }
    })
}

let updateTicketApi = async (url, obj) => {
    
    return await axios.put(base_url + url, obj, {
        headers: {
            "x-access-token":localStorage.getItem("accessToken")
        }
    })
}

let deleteApiCall = async (url) => {
    
    return await axios.delete(base_url + url, {
        headers: {
            "x-access-token":localStorage.getItem("accessToken")
        }
    })
}

let sendEmail = async (url, obj) => {

    return await axios.post(base_url + url, obj, {
        headers: {
            "x-access-token": `${localStorage.getItem("accessToken")}`
        }
    })
}

export { getTickets, createTicketsApi, updateTicketApi, deleteApiCall,sendEmail }





