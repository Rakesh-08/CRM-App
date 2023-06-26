import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function EngineerPage() {
    let NavigateTo = useNavigate();

    useEffect(() => {
        if (!(localStorage.getItem("accessToken") && localStorage.getItem("userType") === "ENGINEER")) {

            NavigateTo("/")
        }
    })

    let user = localStorage.getItem("userType")
    return (
        <div>  
            <h2>{user && `welcome ${user}, how can we help you`} </h2>
        </div>
    )
}