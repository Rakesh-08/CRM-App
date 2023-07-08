
export default function AuthError() {

    let ErrorCode = localStorage.getItem("errorCode")
    let ErrMsg= localStorage.getItem("errMsg")
    
    return (
        <div className=" bg-dark  vh-100 d-flex justify-content-center align-items-center ">
            <div>
                <img className="rounded-5 " src="https://www.plctr.com/wp-content/uploads/plc-errors.jpg" alt="error Sign" />
                <h3 className="my-5 text-white ">{` ${ErrorCode} : ${ErrMsg}`}</h3>
            </div>
            
            
        </div>
    )
}