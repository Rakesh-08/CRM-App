import { useNavigate} from "react-router-dom"
export default function AuthError() {

    let NavigateTo= useNavigate()
    let ErrorCode = localStorage.getItem("errorCode")
    let ErrMsg = localStorage.getItem("errMsg")
    
    if (window.location.reload) {
        NavigateTo("/")
    }
    
    return (
        <div className=" bg-dark  vh-100 d-flex justify-content-center align-items-center ">
            <div>
                <img className="rounded-5 " src="https://www.plctr.com/wp-content/uploads/plc-errors.jpg" alt="error Sign" />
                <h3 className="my-5 text-white text-center p-4 border rounded-2 shadow ">{` ${ErrorCode} : ${ErrMsg}`}</h3>
            </div>
            
            
        </div>
    )
}