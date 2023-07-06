import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom"
import Dashboard from "../Dashboard/dashboard";

export default function AdminPage() {
    let NavigateTo = useNavigate();

    useEffect(() => {
        if (!(localStorage.getItem("accessToken") && localStorage.getItem("userType") === "ADMIN")) {
            
             NavigateTo("/")
        }   
       
    }, [])

  

   
    let user= localStorage.getItem("username")
   
    let title = `Welcome ${user},
        you are currently seeing the admin page ` 
        
       
 
    return (
        <div >
            <Dashboard
                title={title}
                userType={localStorage.getItem("userType")}
                bg={"bg-info" } />
            

        </div>
    )
}