import { useState } from "react";
import {useNavigate} from "react-router-dom"
import "./loginComponent.css";
import authApiCall from "../../apiCalls/auth";

let signUpapi = "/crm/api/v1/auth/signup";
let signInapi = "/crm/api/v1/auth/signin";



let initialState = {
  name: "",
  email: "",
  userId: "",
  password: "",
  userType: "CUSTOMER",
};
let defaultPasswordVisibility={type:"password",class:"fa-eye-slash"}

export default function LoginComponent() {
  let [authInfo, setAuthInfo] = useState(initialState);
  let [showSignup, setShowSignup] = useState(false);
  let [resMsg, setResMsg] = useState({ message: "",color:""});
  let [eyeConfig, setEyeConfig] = useState(defaultPasswordVisibility);
  let NavigateTo = useNavigate();

  let signup = (e) => {
    e.preventDefault();

    authApiCall(signUpapi, authInfo)
      .then((res) => {
         setResMsg({ message: "sign up successfully" , color:"text-success"});
         
      })
      .catch((err) => {
        setResMsg({ message: "sign up failed ! error occurred", color: "text-danger" })
        localStorage.setItem("errorCode",err.request.status)
        NavigateTo("/Error")
      }
      )
   
  };

  let login = (e) => {
    e.preventDefault();
    let credential = {
      userId: authInfo.userId,
      password:authInfo.password
    }

    authApiCall(signInapi, credential)
      .then((res) => {
        let data = res.data;
        
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("username", data.name);
          localStorage.setItem("userType", data.userType);

          NavigateTo(`/${data.userType}`)
            }
         setResMsg({ message: "Login successfully", color: "text-success" });
        
       
      })
      .catch((err) => {
        console.log(err)
        setResMsg({ message: "Login Failed! error occurred", color: "text-danger" });
        localStorage.setItem("errorCode",err.request.status)
        NavigateTo("/Error")
      })
    
   
    
  };



  let togglePasswordvisibility = () => {
    let alternative = {
      type: "text",
      class:"fa-eye"
    }
   

    if (eyeConfig.type === "password") {
         setEyeConfig(alternative)
    } else {
      setEyeConfig(defaultPasswordVisibility)
    }
  }

  return (
    <div className="bg-info vh-100 d-flex justify-content-center align-items-center">
      <div className="card  p-5  form-box rounded-4">
        <h3 className="my-4 text-center">{showSignup ? "Sign Up" : "Login"}</h3>

        <div>
          <form onSubmit={showSignup ? signup : login}>
            {showSignup && (
              <div className="  row">
                <label className="col-4" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className=" m-2 col-7 focus-ring border-white rounded-2"
                  value={authInfo.name}
                  onChange={(e) =>
                    setAuthInfo({ ...authInfo, name: e.target.value })
                  }
                  placeholder="name"
                  required
                />
              </div>
            )}

            {showSignup && (
              <div className=" row">
                <label className="col-4" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  className="m-2 col-7 focus-ring border-white rounded-2"
                  id="email"
                  name="email"
                  value={authInfo.email}
                  onChange={(e) =>
                    setAuthInfo({ ...authInfo, email: e.target.value })
                  }
                  placeholder="email"
                  required
                />
              </div>
            )}

            <div className=" row">
              <label className="col-4" htmlFor="userId">
                userId
              </label>
              <input
                type="text"
                className="m-2 col-7 focus-ring border-white rounded-2"
                id="userId"
                name="userId"
                value={authInfo.userId}
                onChange={(e) =>
                  setAuthInfo({ ...authInfo, userId: e.target.value })
                }
                placeholder="userId"
                required
              />
            </div>
            <div className=" row">
              <label className="col-4" htmlFor="password">
                Password{" "}
              </label>
              <input
                type={eyeConfig.type}
                className="m-2 col-7 focus-ring  border-white rounded-2"
                id="password"
                name="password"
                value={authInfo.password}
                onChange={(e) =>
                  setAuthInfo({ ...authInfo, password: e.target.value })
                }
                placeholder="min 8 characters"
                required
              />
          
                {" "}
                <i className={`fa ${eyeConfig.class}`} id="togglePassword" onClick={togglePasswordvisibility}></i>
             
            </div>

            {showSignup && (
              <div className="row">
                <label className="col-4" htmlFor="userType">
                  user Type
                </label>
                <select
                  id="userType"
                  value={authInfo.userType}
                  onChange={(e) => {
                    setAuthInfo({ ...authInfo, userType: e.target.value });
                  }}
                  className="m-2 col-7  border-white rounded-2 "
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="ENGINEER">ENGINEER</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="my-5 w-25 bg-primary text-white border-0 rounded-1 "
            >
              {showSignup ? "Submit" : "Login"}
            </button>
          </form>
        </div>

        <div>
          <p className="my-2">
            {showSignup
              ? " Already have an account ?"
              : "Don't have an account ?"}
            <button
              onClick={() => {
                setShowSignup(!showSignup);
                setAuthInfo(initialState);
                setResMsg("")
                setEyeConfig(defaultPasswordVisibility)
              }}
              className=" toggleBtn"
            >
              {showSignup ? "login" : "sign up"}
            </button>
          </p>
        </div>
        <h6 className={`${resMsg.color} text-center`} >{resMsg.message}</h6>
      </div>
    </div>
  );
}
