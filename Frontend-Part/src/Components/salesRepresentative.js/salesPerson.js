import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard/dashboard"

export default function SalesRep() {
    let NavigateTo = useNavigate();
    useEffect(() => {
        if (!(
            localStorage.getItem("accessToken") &&
            localStorage.getItem("userType") === "SALES_REP"
        )
        ) {NavigateTo("/"); }
    }, []);


    return (
        <div>
            <Dashboard
                userType={localStorage.getItem("userType")}
                bg={"bg-dark"}
                title={`Hello Mr. ${localStorage.getItem("username")} , let convert these leads into customers`}
            />
        </div>
    )
}