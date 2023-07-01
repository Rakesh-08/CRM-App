import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard/dashboard"




export default function CustomerPage() {
   
    let NavigateTo = useNavigate();
    useEffect(() => {
        if ( !(
                localStorage.getItem("accessToken") &&
                localStorage.getItem("userType") === "CUSTOMER"
            )
        ) {
            NavigateTo("/");
        }

       
    }, []);


   let title = `welcome ${localStorage.getItem(
        "username"
    )} , how can we help you today`

    return (
        <div>
            <Dashboard
                title={title}
                />
        </div>
       
    )
}


