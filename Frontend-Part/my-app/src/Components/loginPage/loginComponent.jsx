import { useState } from "react";
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

export default function LoginComponent() {
  let [authInfo, setAuthInfo] = useState(initialState);
  let [showSignup, setShowSignup] = useState(false);
  let [resMsg, setResMsg] = useState("");

  let signup = (e) => {
    e.preventDefault();

    authApiCall(signUpapi, authInfo)
      .then((res) => {
        setResMsg("sign up successfully")
         setAuthInfo(initialState);
      })
      .catch((err) => setResMsg("error occurred while signing up " + err.code));
  

   
  };

  let login = (e) => {
    e.preventDefault();
    let credential = {
      userId: authInfo.userId,
      password:authInfo.password
    }

    authApiCall(signInapi, credential)
      .then((data) => {
        console.log(data)
        setResMsg("Login successfully")
        setAuthInfo(initialState);
      })
      .catch((err) => {
        console.log(err)
        setResMsg("error occurred while logging in  " + err.code)
      })
   
    
  };

  return (
    <div className="bg-info vh-100 d-flex justify-content-center align-items-center">
      <div className="card  p-5  form-box rounded-4">
        <h3 className="my-4 text-center">{showSignup ? "Sign Up" : "Login"}</h3>

        <div>
          <form onSubmit={showSignup ? signup : login}>
            {showSignup && (
              <div className="  d-flex justify-content-around flex-wrap">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className=" m-2"
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
              <div className="  d-flex justify-content-around flex-wrap">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="m-2"
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

            <div className="  d-flex justify-content-around flex-wrap">
              <label htmlFor="userId">userId</label>
              <input
                type="text"
                className="m-2"
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
            <div className=" d-flex justify-content-around flex-wrap">
              <label htmlFor="password">Password </label>
              <input
                type="password"
                className="m-2"
                id="password"
                name="password"
                value={authInfo.password}
                onChange={(e) =>
                  setAuthInfo({ ...authInfo, password: e.target.value })
                }
                placeholder="atleast 8 characters"
                required
              />
            </div>

            {showSignup && (
              <div className=" d-flex justify-content-around flex-wrap">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  value={authInfo.userType}
                  onChange={(e) => {
                    setAuthInfo({ ...authInfo, userType: e.target.value });
                  }}
                  className="m-2 w-50"
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="ENGINNER">ENGINEER</option>
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
              }}
              className=" toggleBtn"
            >
              {showSignup ? "login" : "sign up"}
            </button>
          </p>
        </div>
        <h6 className="text-success text-center">{resMsg}</h6>
      </div>
    </div>
  );
}
