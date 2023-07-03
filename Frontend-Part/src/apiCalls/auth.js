
import axios from "axios";
import base_url from "./apiUtils";


let authApiCall = async (url,obj) => {
    
     return await axios.post( base_url + url, obj)
 
}



export default authApiCall;





