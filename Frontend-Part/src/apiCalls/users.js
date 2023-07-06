import base_url from "./apiUtils";
import axios from "axios";

let getUsers = async (url,status) => {

    return await axios.get(base_url + url +`?userType=${status}`, {
        headers: {
            "x-access-token": `${localStorage.getItem("accessToken")}`
        }
    })

}

export {getUsers}
