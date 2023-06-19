import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

export default function CustomerPage() {
    let NavigateTo = useNavigate();

    useEffect(() => {
        if (!(localStorage.getItem("accessToken") && localStorage.getItem("userType") === "CUSTOMER")) {

            NavigateTo("/")
        }
    })

    let logoutFn = () => {
        
        let ans = window.confirm("Are you sure ?");
        
        if (ans) {
            localStorage.removeItem("accessToken")
            localStorage.removeItem('username');
            localStorage.removeItem("userType");

            window.location.reload();
        }
    }

    let user = localStorage.getItem("userType")

    return (
        <div>
            <h2>{user && `welcome ${user}, how can we help you`} </h2>
        </div>
    )
}