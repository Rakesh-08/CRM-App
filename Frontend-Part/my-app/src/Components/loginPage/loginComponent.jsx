import { useState } from "react";
import "./loginComponent.css";

  let initialState = {
    name: "",
    email: "",
    userId: "",
    password: "",
    role: "customer",
  };

export default function LoginComponent() {
  let [authInfo, setAuthInfo] = useState(initialState);
 let [showSignup, setShowSignup] = useState(false);

  let handleSubmit = (e) => {
    e.preventDefault()
    console.log(JSON.stringify(authInfo))
    alert("form submitted")

    setAuthInfo(initialState)
    
  };

  return (
    <div className="bg-info vh-100 d-flex justify-content-center align-items-center">
      <div className="card h-75 p-5  form-box shadow-lg rounded-4">
        <h3 className="my-4 text-center">{showSignup ? "Signup" : "Login"}</h3>

        <div>
          <form onSubmit={handleSubmit}>
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
                placeholder="e.g [a-z][0-9]"
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
                <label htmlFor='role'>Role</label>
                <select
                  id="role"
                  value={authInfo.role}
                  onChange={(e) => {
                    setAuthInfo({ ...authInfo, role: e.target.value });
                  }}
                  className="m-2 w-50"
                >
                  <option value="customer">customer</option>
                  <option value="engineer">engineer</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="my-5 w-25 bg-success text-white border-0 "
            >
              Submit
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
              {showSignup ? "login" : "signup"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
