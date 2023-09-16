import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard/dashboard";


export default function EngineerPage() {
    let NavigateTo = useNavigate();

    useEffect(() => {
        if (!(localStorage.getItem("accessToken") && localStorage.getItem("userType") === "ENGINEER")) {

            NavigateTo("/")
        }
    })

     let title = `welcome ${localStorage.getItem("username")}, lets resolve the queries and close the tickets`
    
    return (
        <div> 
            <Dashboard title={title} userType={localStorage.getItem("userType")} bg={"bg-primary"} adminRoutes="tickets" />
           
        </div>
    )
}