import base_url from "./apiUtils";
import axios from "axios";


let token = {
    headers: {
        "x-access-token": `${localStorage.getItem("accessToken")}`
    }
}

let getUsers = async (status) => {
    return await axios.get(base_url + `/crm/api/v1/users?userType=${status}`, token)

}

let updateUser = async ( id,obj) => {
    return await axios.put(base_url + "/crm/api/v1/users/"+id ,obj,token)

}

export {getUsers,updateUser}
