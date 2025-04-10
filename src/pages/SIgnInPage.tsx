import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
const SignInPage = () => {
  useEffect(() => {
    const rand = Math.round(1 + Math.random() * 39);
    setNum(rand);
  }, []);

  const [r_num, setNum] = useState(0);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setShowMessage] = useState("");
  const [student_num, setStudentNum] = useState("");
  const [QRcode, setQRcode] = useState("");
  const fetch_data = async () => {
    try {
      const result = await axios.get("http://192.168.56.2:3001/api/QR/login");
      setQRcode(result.data.url);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err);
      }
    }
  };
  useEffect(() => {
    const data = async () => {
      await fetch_data();
    };
    data();
  }, []);

  const to_seconds = (work_hours: {
    hours: number;
    minutes: number;
    seconds: number;
  }) => {
    const { hours, minutes, seconds } = work_hours;
    return (hours * 3600) + (minutes * 60) + seconds;
  };
  
  useEffect(() => {
    setTimeout(() => {
      setShowMessage("");
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
    setLoading(true);
    if (student_num.startsWith("110")) {
    } else {
      let obj = {
        data: {
          password: password,
          code: +student_num,
        },
      };
      try {
        const res = await axios.post(
          " http://192.168.56.2:3001/api/platformUser/login",
          obj
        );
        if ((res.status = 200)) {
          const u = res.data.data.user;
          const m = res.data.data.metrics;
          const ac = res.data.data.attendance_current;
          const a = res.data.data.attendances;
          console.log("server replay ", res.data);
          let user = {
            ...u,
            metrics: {
              ...m,
            },
            attendance_current: {
              ...ac,
            },
            attendances: a,
          };
          const seconds = to_seconds(user.metrics.current_working_hours);
          dispatch(setTime(seconds));
          if (user.clocked_in) {
            dispatch(startTimer());
          }
          dispatch(setUserDetails(user));
          nav("/Dashboard");
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.status === 403) {
            setShowMessage(err.message);
          }
        }
      }
    }
  };

  return (
    <div className="flex  min-h-screen bg-gray-100">
      <div className="absolute top-5 right-5">
        <button
          onClick={() => nav("/api/login")}
          className="hover:bg-[#2b81ba] font-poppins text-white bg-[#1D9BF0] rounded-tr-none  p-2 rounded-l-md text-sm"
        >
          Admin
        </button>
      </div>
      <div className="bg-[#C6E6FB]  w-full  items-center">
        <div className=" self-center p-12  ">
          <h1 className="font-poppins font-semibold text-[30px]">Login</h1>
          <h1 className="font-poppins font-semibold text-[25px] mt-2">
            Welcome Back
          </h1>
          <p className="font-poppins font-light text-[16px] mt-2">
            Please enter your Attendance credentials below.
          </p>
          {message.length > 2 && (
            <div>
              <p className="font-poppins font-light text-red-500 text-[16px] mt-2">
                {/* {message} */}
                incorrect credentials
              </p>
            </div>
          )}

          <div className=" flex gap-16 mb-1">
            <div className="mt-5 ">
              <p className="font-poppins font-semibold text-[15px]">
                Attendance Code
              </p>
              <input
                onChange={handleChangeStudentNumber}
                placeholder="Attendance Code "
                className="mt-1 placeholder:text-[#83ACD8] placeholder:font-poppins
                pl-2 font-poppins text-[#83ACD8] rounded-md
                placeholder:pl-2 focus:outline-none
              w-[565px] h-[35px] border-2 border-[#83ACD8]"
                type="text"
              ></input>
            </div>
          </div>
          <div className=" flex gap-16 mb-1">
            <div className="mt-5 ">
              <p className="font-poppins font-semibold text-[15px]">Password</p>
              <input
                onChange={handleChangePassword}
                placeholder="Password "
                className="mt-1 placeholder:text-[#83ACD8] placeholder:font-poppins
                pl-2 font-poppins text-[#83ACD8]
                placeholder:pl-2 focus:outline-none rounded-md
              w-[565px] h-[35px] border-2 border-[#83ACD8]"
                type="password"
              ></input>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className=" mt-5 hover:bg-[#2b81ba] items-center flex justify-center  gap-3 font-poppins text-white bg-[#1D9BF0] w-[565px] p-2  rounded-md "
          >
            Login
            {loading && <Spinner color="green" />}
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r flex items-center justify-center  from-[#72C0F6] via-[#56B4F4] to-[#1D9BF0] w-full">
        {QRcode.length < 5 ? (
          <div className="bg-gradient-to-r  from-[#72C0F6] via-[#56B4F4] to-[#1D9BF0] items-center flex justify-center w-full">
            <p className="font-poppins p-4 font-semibold text-[19px] bg-gradient-to-r from-[#262626] via-[#b0ba6a] to-[#a3ba0c] text-transparent bg-clip-text ">
              {workMotivationQuotes[r_num]}
            </p>
          </div>
        ) : (
          <img src={QRcode} className=" w-[200px] h-[200px]" alt="qr_code" />
        )}
      </div>
    </div>
  );
};

export default SignInPage;
