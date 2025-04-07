import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCubesStacked,
  faChartColumn,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { log_out } from "./SideMenuBarHR";
import { UserState } from "../redux/UserSlice";
type Props = {
  current: string;
};
export const redirect_main = (user: UserState, nav: NavigateFunction) => {
  if (user.first_name.length < 2) {
    nav("/");
    window.location.reload();
  }
};

export default function SideMenuBar({ current }: Props) {
  const usr = useSelector((state: RootState) => state.user);
  const nav = useNavigate();
  useEffect(() => {
    redirect_main(usr.defaultUser, nav);
  }, []);
  return (
    <div className="bg-white   w-[250px] ">
      <div className="p-3 h-[220px] mb-12">
        <div className="h-[170px] flex justify-center  ">
          <span className="font-poppins text-[120px] text-[#2b59e3]  font-semibold">
            h
          </span>
          <span className="font-poppins text-[100px] text-[#46bc48] mt-6  font-semibold">
            i
          </span>
        </div>
        <div>
          <p className="font-poppins font-semibold text-[#1D9BF0] text-[20px] text-center">
            {usr.defaultUser.first_name} {usr.defaultUser.last_name}
          </p>
        </div>
      </div>

      <div
        onClick={() => {
          nav("/Dashboard");
        }}
        className={`mt-2 hover:cursor-pointer p-2 ${
          current === "Dashboard" ? "bg-[#1D9BF0]" : ""
        } `}
      >
        <div className="flex  items-center gap-3">
          <FontAwesomeIcon
            color={`${current === "Dashboard" ? "white" : "#1D9BF0"}`}
            icon={faCubesStacked}
            size="1x"
          />
          <p
            className={`text-[14px] ${
              current === "Dashboard" ? "text-white" : "text-[#1D9BF0]"
            } font-poppins font-semibold`}
          >
            Dashboard
          </p>
        </div>
      </div>
      <div
        onClick={() => {
          nav("/AttendanceReport");
        }}
        className={`mt-3 hover:cursor-pointer p-2  ${
          current === "AttendanceReport" ? "bg-[#1D9BF0]" : ""
        }`}
      >
        <div className="flex  items-center gap-3">
          <FontAwesomeIcon
            color={`${current === "AttendanceReport" ? "white" : "#1D9BF0"}`}
            icon={faChartColumn}
            size="1x"
          />
          <p
            className={`text-[14px] ${
              current === "AttendanceReport" ? "text-white" : "text-[#1D9BF0]"
            } font-poppins font-semibold`}
          >
            Attendance Report
          </p>
        </div>
      </div>
      <div
        onClick={() => {
          nav("/MyAccount");
        }}
        className={`mt-3 hover:cursor-pointer p-2 ${
          current === "MyAccount" ? "bg-[#1D9BF0]" : ""
        }`}
      >
        <div className="flex  items-center gap-3">
          <FontAwesomeIcon
            color={`${current === "MyAccount" ? "white" : "#1D9BF0"}`}
            icon={faUser}
            size="1x"
          />
          <p
            className={`text-[14px] ${
              current === "MyAccount" ? "text-white" : "text-[#1D9BF0]"
            } font-poppins font-semibold`}
          >
            My Account
          </p>
        </div>
      </div>
      <div
        onClick={() => {
          log_out(nav);
        }}
        className={`mt-3 hover:cursor-pointer p-2  `}
      >
        <div className="flex  items-center gap-3">
          <FontAwesomeIcon
            className={` hover:cursor-pointer  text-[#1D9BF0]  hover:text-red-500 `}
            icon={faChartColumn}
            size="1x"
          />
          <p
            className={`text-[14px] text-[#1D9BF0] hover:text-red-500  font-poppins font-semibold`}
          >
            Exit
          </p>
        </div>
      </div>
    </div>
  );
}
