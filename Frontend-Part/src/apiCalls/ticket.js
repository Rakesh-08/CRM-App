
import axios from "axios";
import base_url from "./apiUtils";


let getTickets = async (url) => {

    return await axios.get(base_url + url, {
        headers: {
            "x-access-token": `${localStorage.getItem("accessToken")}`
        }
    })

}

let createTickets = async (url, obj) => {
    
    return await axios.post(base_url + url, obj, {
        headers: {
            "x-access-token": `${localStorage.getItem("accessToken")}`
        }
    })
}

export {getTickets,createTickets}





