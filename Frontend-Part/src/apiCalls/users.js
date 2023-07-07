import base_url from "./apiUtils";
import axios from "axios";


let token = {
    headers: {
        "x-access-token": `${localStorage.getItem("accessToken")}`
    }
}

let getUsers = async (url,status) => {
  return await axios.get(base_url + url +`?userType=${status}`, token)

}

let updateUser = async (url, obj) => {
    return await axios.put(base_url + url ,obj,token)

}

export {getUsers,updateUser}
