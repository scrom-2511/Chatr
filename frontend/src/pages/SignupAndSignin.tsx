import { useEffect, useState } from "react";
import type { RootState } from "../app/store";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setEmail, setPassword, setUsername } from "../features/auth/AuthSlice";
import { useNavigate } from "react-router-dom";
import cryptojs from "crypto-js";
import { socket } from "../utils/socket";

enum method {
  signup = "signup",
  signin = "signin",
}

const SignupAndSignin = () => {
  return (
    <div className="h-full w-full flex items-center justify-center gap-8">
      <LeftPart />
      <RightPart />
    </div>
  );
};

const LeftPart = () => {
  return (
    <div className="h-[90%] w-4xl ">
      <img
        src="/images/signup_and_login.jpg"
        alt=""
        className="object-cover w-full h-full opacity-80"
      />
    </div>
  );
};

const RightPart = () => {
  const [authMethod, setAuthMethod] = useState(method.signin);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  const username = useSelector(
    (state: RootState) => state.authentication.username
  );
  const email = useSelector((state: RootState) => state.authentication.email);
  const password = useSelector(
    (state: RootState) => state.authentication.password
  );

  useEffect(() => {
  }, [username, password, email]);

  const dispatch = useDispatch();

  const authMethodHandler = () => {
    setAuthMethod(authMethod === method.signup ? method.signin : method.signup);
  };
  const handleOnClick = async () => {
    if (authMethod === method.signup) {
      const data = { username, email, password };
      try {
        const req = await axios.post(
          "http://localhost:3000/user/signup",
          data
        );
        if (req.data.success === true) {
          dispatch(setUsername("")); // Clear username
          dispatch(setEmail("")); // Clear email
          dispatch(setPassword("")); // Clear password
          setAuthMethod(method.signin); // Switch to signin form
        }
      } catch (error) {
        console.error("Signup error:", error);
      }
    } else {
      const data = { email, password };
      try {
        const req = await axios.post(
          "http://localhost:3000/user/signin",
          data,
          { withCredentials: true }
        );
        if (req.data.success === true) {
          navigate("/chat");
          socket.emit("onlineUsers", req.data);
          const myUserId = req.data.userData.userId;
          localStorage.setItem("myUserId", myUserId);
          localStorage.setItem("publicKeySender", req.data.userData.publicKey);
          localStorage.setItem("privateKeySender", cryptojs.AES.decrypt(req.data.userData.encryptedPrivateKey, password).toString(cryptojs.enc.Utf8));
        }
      } catch (error) {
        console.error("Signin error:", error);
      }
    }
  };

  return (
    <div className="h-[90%] w-4xl bg-gray-800 text-white flex flex-col items-center justify-center">
      <h1 className="mb-6 text-3xl">
        {authMethod === "signup"
          ? "CREATE AN ACCOUNT"
          : "SIGNIN TO YOUR ACCOUNT"}
      </h1>
      <div className="flex flex-row text-gray-300">
        <h1>
          {authMethod === "signup"
            ? "Already have an account?"
            : "Don't have an account?"}
        </h1>
        <h1 onClick={authMethodHandler} className="hover:cursor-pointer">
          {authMethod === method.signup ? "SIGNIN" : "SIGNUP"}
        </h1>
      </div>
      <div className="flex flex-col w-full items-center gap-10 my-12">
        <input
          value={email}
          onChange={(e) => dispatch(setEmail(e.target.value))}
          placeholder="EMAIL"
          type="text"
          className="bg-[#434a59] h-16 w-[70%] text-l p-8"
        />
        {authMethod === method.signup && (
          <input
            value={username}
            onChange={(e) => dispatch(setUsername(e.target.value))}
            placeholder="USERNAME"
            type="text"
            className="bg-[#434a59] h-16 w-[70%] text-l p-8"
          />
        )}
        <input
          value={password}
          onChange={(e) => dispatch(setPassword(e.target.value))}
          placeholder="PASSWORD"
          type="password"
          className="bg-[#434a59] h-16 w-[70%] text-l p-8"
        />
        <button
          className="h-16 w-[70%] text-2xl bg-[#084e6a]"
          disabled={!isChecked}
          onClick={handleOnClick}
        >
          {authMethod === method.signup ? "SIGNUP" : "SIGNIN"}
        </button>
      </div>
      <div className="flex">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => setIsChecked((prev) => !prev)}
        />
        <h1 className="px-2">I agree to the</h1>
        <h1>Terms & Conditions</h1>
      </div>
    </div>
  );
};

export default SignupAndSignin;
