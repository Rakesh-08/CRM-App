import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard/dashboard";


export default function EngineerPage() {
    let NavigateTo = useNavigate();
    let engineer = localStorage.getItem("userType")

    useEffect(() => {
        if (!(localStorage.getItem("accessToken") && engineer === "ENGINEER")) {

            NavigateTo("/")
        }
    })

     let title = `welcome ${localStorage.getItem("username")}, lets resolve the queries and close the tickets`
    
    return (
        <div> 
            <Dashboard title={title} engineer={engineer} />
           
        </div>
    )
}