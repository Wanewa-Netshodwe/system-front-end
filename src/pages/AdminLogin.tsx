import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Route, useLocation, useNavigate } from "react-router-dom";
import { setHR, setUserDetails, UserState } from "../redux/UserSlice";
import Spinner from "../components/Spinner";
import axios from "axios";
import { punctualityQuotes } from "../utils/Quotes";
import {
  setAllattendance,
  setHRattendanceData,
} from "../redux/AttendanceSlice";
import { setAPIKey } from "../redux/appSlice";

const AdminLogin = () => {
  const key = useLocation();
  const [email, setEmail] = useState("");
  useEffect(() => {
    console.log("state : ", key.state);
    if (key.state) {
      setEmail(key.state.api_key);
    }
    const rand = Math.round(1 + Math.random() * 39);
    setNum(rand);
  }, []);

  const [r_num, setNum] = useState(0);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(true);
  const [correct, setCorrect] = useState(true);

  const [contact, setContact] = useState("");
  const [first_name, setFirstname] = useState("");
  const [last_name, setLastname] = useState("");
  const [student_num, setStudentNum] = useState("");
  const [gender, setGender] = useState("Male");
  const [job, setJob] = useState("Business Analyst");
  const [department, setDepartment] = useState("Computer Science");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!valid) {
      setTimeout(() => {
        setValid(true);
      }, 2000);
    }
  }, [valid]);
  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleRegistration = async (e: React.FormEvent) => {
    try {
      let obj = {
        code: student_num,
      };
      const result = await axios.get(
        "http://192.168.56.2:3001/api/users/login",
        {
          headers: { api_key: `${email}` },
        }
      );
      if (result.status === 200) {
        console.log("apai key ", email);
        const result = await axios.get(
          "http://localhost:3001/api/hr/reportAttendance",
          {
            headers: { api_key: `${email}` },
          }
        );
        if (result.status === 200) {
          dispatch(setHR({ valid: true }));
          const user_data = result.data.users;
          const yesterday_rec = result.data.yesterday_rec;
          dispatch(setAllattendance(user_data));
          console.log("yesstady rec _ " + JSON.stringify(yesterday_rec));
          dispatch(setHRattendanceData(yesterday_rec));
          dispatch(setAPIKey(email));
          setTimeout(() => {
            nav("/HR/Dashboard");
          }, 2000);
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.status === 403) {
          setValid(false);
          setMessage("Invalid Api Key");
        } else if (err.status === 404) {
          setValid(false);
          setMessage("Key Expired request new one");
        }
      }
    }
  };

  return (
    <div className="flex  min-h-screen bg-gray-100">
      <div className="bg-[#C6E6FB]  w-full  items-center">
      <div className="absolute top-5 right-5">
        <button
          onClick={() => nav("/")}
          className="hover:bg-[#2b81ba] font-poppins text-white bg-[#1D9BF0] rounded-tr-none  p-2 rounded-l-md text-sm"
        >
          Student
        </button>
      </div>
        <div className=" self-center p-12  ">
          <h2 className="font-poppins font-semibold text-[30px]">
            Welcome Back
          </h2>
          {!valid && (
            <p className="font-poppins font-bold text-red-600 text-[16px] mt-2">
              {message}
            </p>
          )}

          <p className="font-poppins font-light text-[16px] mt-2">
            Please fill in your API Key to login
          </p>

          <div className=" flex gap-16 mb-1">
            <div className="mt-5 ">
              <p className="font-poppins font-semibold text-[15px]">API KEY</p>
              <input
                value={email}
                onChange={handleChangeEmail}
                placeholder="API KEY "
                className="mt-1 placeholder:text-[#83ACD8] placeholder:font-poppins
                pl-2 font-poppins text-[#83ACD8] rounded-md
                placeholder:pl-2 focus:outline-none
              w-[565px] h-[35px] border-2 border-[#83ACD8]"
                type="text"
              ></input>
            </div>
          </div>

          <button
            onClick={handleRegistration}
            className=" gap-3 mt-5 hover:bg-[#2b81ba] items-center flex justify-center font-poppins text-white bg-[#1D9BF0] w-[565px] p-2  rounded-md "
          >
            {" "}
            Login
            {loading && <Spinner color="green" />}
          </button>
          <p className="mt-5 text-center mr-24 text-[#5A91CB] text-poppins font-semibold ">
            Dont have Key Request one?
            <span
              className="text-[#1D9BF0] cursor-pointer"
              onClick={async () => {
                nav("/api/verify", { state: { valid: true } });
                await axios.get(
                  "http://192.168.56.2:3001/api/users/requestkey"
                );
              }}
            >
              Here
            </span>
          </p>
        </div>
      </div>
      <div className="bg-gradient-to-r  from-[#72C0F6] via-[#56B4F4] to-[#1D9BF0] items-center flex justify-center w-full">
        <p className="font-poppins p-4 font-semibold text-[18px] bg-gradient-to-r from-[#fbfbfb] via-[#5e6062] to-[#363636] text-transparent bg-clip-text ">
          {punctualityQuotes[r_num]}
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
