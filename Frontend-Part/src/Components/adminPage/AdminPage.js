import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom"

export default function AdminPage() {
    let NavigateTo = useNavigate();

    useEffect(() => {
        if (!(localStorage.getItem("accessToken") && localStorage.getItem("userType") === "ADMIN")) {
            
             NavigateTo("/")
        }   
       
    }, [])

  

    let user= localStorage.getItem("userType")
   
        
        
       
 
    return (
        <div className="p-5 ">
            <h2>{user && `welcome ${ user}, how can we help you`} </h2>

        </div>
    )
}