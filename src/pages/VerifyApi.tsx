import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  setClockin,
  setHR,
  setUserDetails,
  UserState,
} from "../redux/UserSlice";
import { useDispatch } from "react-redux";
import { setTime, startTimer } from "../redux/timerSlice";
import {
  AttendanceData,
  setAllattendance,
  setHRattendanceData,
  UserAttendance,
} from "../redux/AttendanceSlice";
import { workMotivationQuotes } from "../utils/Quotes";
import Spinner from "../components/Spinner";

const VerifyApi = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.state === null) {
      nav("/");
      window.location.reload();
    }
  }, []);
  useEffect(() => {
    const rand = Math.round(1 + Math.random() * 39);
    setNum(rand);
  }, []);

  const [r_num, setNum] = useState(0);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setShowMessage] = useState(false);
  const [student_num, setStudentNum] = useState("");
  const [apk_key, setApiKey] = useState("");

  useEffect(() => {
    if (!(apk_key === "")) {
      nav("/api/login", { state: { api_key: apk_key } });
    }
  }, [apk_key]);

  useEffect(() => {
    setTimeout(() => {
      setShowMessage(false);
      setLoading(false);
    }, 4000);
  }, [message]);
  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleChangeStudentNumber = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStudentNum(event.target.value);
  };
  const handleSubmit = async () => {
    try {
      let obj = {
        code: +student_num.trim(),
      };
      const result = await axios.post(
        "http://localhost:3001/api/users/verify",
        obj
      );
      setApiKey(result.data.apiKey);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.status === 403) {
          setShowMessage(true);
        }
      }
    }
  };

  return (
    <div className="flex  min-h-screen bg-gray-100">
      <div className="bg-[#C6E6FB]  w-full  items-center">
        <div className=" self-center p-12  ">
          <h1 className="font-poppins font-semibold  text-[30px]">Verify</h1>
          <p className="font-poppins font-light text-[16px] mt-2">
            a verification code was send to the{" "}
            <span className="font-poppins font-semibold text-[20px]">
              admin
            </span>{" "}
            email
            <i> the email may take about 1 minutes to arrive</i>
          </p>
          <p className="font-poppins font-light  text-[16px] mt-2">
            Enter code to get{" "}
            <span className="font-poppins font-semibold text-[20px]">
              API KEY
            </span>
          </p>
          {(apk_key.length > 0 || message) && (
            <div>
              <p className="font-poppins font-light text-red-500 text-[16px] mt-2">
                {apk_key.length > 0 && apk_key}
                {message && "Invalid Code"}
              </p>
            </div>
          )}

          <div className=" flex gap-16 mb-1">
            <div className="mt-5 ">
              <input
                onChange={handleChangeStudentNumber}
                placeholder="Code"
                min={1}
                max={10}
                className="mt-1 placeholder:text-[#83ACD8] placeholder:font-poppins
                pl-2 font-poppins text-[#313234] rounded-md
                placeholder:pl-2 focus:outline-none
              w-[156px] h-[35px] border-2 border-[#83ACD8]"
                type="text"
              ></input>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className=" mt-5 hover:bg-[#2b81ba] items-center flex justify-center  gap-3 font-poppins text-white bg-[#1D9BF0] w-[253px] p-2  rounded-md "
          >
            get key
            {loading && <Spinner color="green" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyApi;
