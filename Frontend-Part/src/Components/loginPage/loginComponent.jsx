import { useState,useEffect } from "react";
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
  let [resMsg, setResMsg] = useState("");
  let [eyeConfig, setEyeConfig] = useState(defaultPasswordVisibility);
  let [spinner,setSpinner]= useState(false)
  let NavigateTo = useNavigate();

  useEffect(() => {
      
    if (localStorage.getItem("accessToken")) {
         NavigateTo(`/${localStorage.getItem("userType")}`)
    }


  },[])

  let signup = (e) => {
    e.preventDefault();
    setSpinner(true)

    authApiCall(signUpapi, authInfo)
      .then((res) => {
        setSpinner(false);

         setResMsg("Sign up successfully");
         
      })
      .catch((err) => {
        console.log(err.response.data)
        localStorage.setItem("errorCode", err.request.status)
        localStorage.setItem("errMsg",err.response.data.message)
        NavigateTo("/Error")
      }
    )
    
   
   
  };

  let login = (e) => {
    e.preventDefault();
    setSpinner(true)
    let credential = {
      userId: authInfo.userId,
      password:authInfo.password
    }

    authApiCall(signInapi, credential)
      .then((res) => {
        let data = res.data;
        setSpinner(false) 
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("username", data.name);
          localStorage.setItem("userType", data.userType);
          localStorage.setItem('userId',data.userId)
          NavigateTo(`/${data.userType}`)
            }
        
       
      })
      .catch((err) => {
        console.log(err.response.data)
        localStorage.setItem("errorCode", err.request.status)
        localStorage.setItem("errMsg",err.response.data.message)
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
    <div className="bg-info vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="mb-2">
        <h1 className="py-2 mb-3 lead fs-1 text-light text-uppercase ">welcome to  <span className="text-secondary">customer support service</span></h1>
      </div>
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
                  className=" m-2 col-7 focus-ring border-white  rounded-2"
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
              />{" "}
              <i
                className={`fa ${eyeConfig.class}`}
                id="togglePassword"
                onClick={togglePasswordvisibility}
              ></i>
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

        {spinner && (
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}

        <div>
          <p className="my-2 text-primary text-underline">
            {showSignup
              ? " Already have an account ?"
              : "Don't have an account ?"}
            <button
              onClick={() => {
                setShowSignup(!showSignup);
                setAuthInfo(initialState);
                setResMsg("");
                setEyeConfig(defaultPasswordVisibility);
              }}
              className=" toggleBtn"
            >
              {showSignup ? "login" : "sign up"}
            </button>
          </p>
        </div>
        <h6 className={`text-success text-center`}>{resMsg}</h6>
      </div>
    </div>
  );
}
