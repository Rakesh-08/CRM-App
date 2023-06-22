
import axios from "axios";
import base_url from "./apiUtils";


let getTickets = async (url) => {

    return await axios.get(base_url + url, {
        headers: {
            "x-access-token": `${localStorage.getItem("accessToken")}`
        }
    })

}

export default getTickets;





