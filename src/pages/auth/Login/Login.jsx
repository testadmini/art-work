import React from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { BsEyeSlash } from "react-icons/bs";
import { BsEye } from "react-icons/bs";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthProvider.js";
import { useData } from "../../../contexts/DataProvider.js";
import { ethers } from "ethers";

export const Login = () => {
  const { loading } = useData();
  const [hidePassword, setHidePassword] = useState(true);
  const { error, loginCredential, setLoginCredential, loginHandler } =
    useAuth();

  const { email, password } = loginCredential;

  let provider;
  try {
    if (window.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum);
    } else {
      throw new Error("Ethereum provider not found");
    }
  } catch (err) {
    // Handle the error (e.g., alert the user to install MetaMask)
  }
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);

  const connectwalletHandler = () => {
    if (window.ethereum) {
      provider.send("eth_requestAccounts", []).then(async () => {
        const signer = await provider.getSigner();
        await accountChangedHandler(signer);
      });
    } else {
      setErrorMessage("Please Install Metamask!!!");
    }
  };

  const accountChangedHandler = async (newAccount) => {
    const address = await newAccount.getAddress(); // Correct method to get address from signer
    setDefaultAccount(address);
  };

  return (
    !loading && (
      <div className="login-container">
        <h2>Login</h2>
        <form
          onSubmit={(e) => loginHandler(e, email, password)}
          className="login-body"
        >
          <div className="email-container">
            <label htmlFor="email">Email</label>
            <input
              value={loginCredential.email}
              required
              onChange={(e) =>
                setLoginCredential({
                  ...loginCredential,
                  email: e.target.value,
                })
              }
              id="email"
              placeholder="Email Address"
              type="email"
            />
          </div>

          <div className="password-container">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <input
                value={loginCredential.password}
                required
                onChange={(e) =>
                  setLoginCredential({
                    ...loginCredential,
                    password: e.target.value,
                  })
                }
                id="password"
                placeholder="Password"
                type={hidePassword ? "password" : "text"}
              />{" "}
              {!hidePassword ? (
                <BsEye
                  className="hide-show-password-eye"
                  onClick={() => setHidePassword(!hidePassword)}
                />
              ) : (
                <BsEyeSlash
                  className="hide-show-password-eye"
                  onClick={() => setHidePassword(!hidePassword)}
                />
              )}
            </div>
          </div>

          <div className="remember-me-container">
            <div>
              <input name="remember-me" type="checkbox" />
              <label htmlFor="remember-me">Keep me signed in</label>
            </div>

            <p>Forgot your password?</p>
          </div>
          {error && <span className="error">{error}</span>}
          <div className="login-btn-container">
            <input value="Login" type="submit" />
            <button
              onClick={(e) => {
                loginHandler(e, "aniketsaini65@gmail.com", "aniketSaini258");
              }}
            >
              Login with Test Credentials
            </button>
          </div>
          <div className="login-btn-container">
            <input value="Metamask" type="submit" />
            <button
              onClick={
                connectwalletHandler
              }
            >
              {defaultAccount ? "Connected!!" : "Connect"}            </button>
          </div>
          <div>{defaultAccount ?? defaultAccount}</div>
          <Link className="new-account" to="/signup">
            Create a new account?
          </Link>
        </form>
      </div>
    )
  );
};
