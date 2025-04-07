import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faChartColumn,
  faUser,
  faDoorOpen,
  faUserPlus,
  faAddressCard,
  faAdd,
  faPlusMinus,
} from "@fortawesome/free-solid-svg-icons";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { UserState } from "../redux/UserSlice";
type Props = {
  current: string;
};
export const log_out = (nav: NavigateFunction) => {
  localStorage.clear();
  nav("/");
  window.location.reload();
};
export const redirect_HR = (key: any, nav: NavigateFunction) => {
  if (key.length < 5) {
    nav("/");
    window.location.reload();
  }
};

export default function SideMenuBarHR({ current }: Props) {
  const usr = useSelector((state: RootState) => state.app.api_key);
  const nav = useNavigate();
  useEffect(() => {
    redirect_HR(usr, nav);
  }, []);
  return (
    <div className="bg-[#3A4C4F] h-[100vh]   w-[250px] ">
      <div className="w-full pl-3">
        <div className="mb-5">
          <span className="font-poppins font-bold text-[58px] text-[#f6f0d2]">
            HR
          </span>
          <span className="font-poppins font-bold text-[28px] text-[#bcb79f]">
            Staff
          </span>
        </div>
        <p className="font-poppins font-semibold  text-white mb-4 ">Menu</p>

        <div
          onClick={() => {
            nav("/HR/Dashboard");
          }}
          className="flex hover:cursor-pointer items-center mb-3"
        >
          <div
            className={`${
              current === "attendance" && "bg-[#ddc764]"
            } mt-4  w-1 h-9`}
          ></div>
          <div className=" p-2 rounded-sm w-[180px]  flex items-center gap-3 mt-4">
            <FontAwesomeIcon
              icon={faCalendar}
              size="1x"
              color={`${current === "attendance" ? "#f6f0d2" : "#fffe"}`}
            />
            <p
              className={`font-poppins font-semibold text-[14px] ${
                current === "attendance" ? "text-[#f6f0d2]" : "text-[#fffe]"
              } `}
            >
              Attendance
            </p>
          </div>
        </div>
        <div
          onClick={() => {
            nav("/HR/week_register");
          }}
          className="flex hover:cursor-pointer items-center mb-3"
        >
          <div
            className={`${
              current === "weekly_register" && "bg-[#ddc764]"
            } mt-4  w-1 h-9`}
          ></div>
          <div className=" p-2 rounded-sm w-[180px]  flex items-center gap-3 mt-4">
            <FontAwesomeIcon
              icon={faAddressCard}
              size="1x"
              color={`${current === "weekly_register" ? "#f6f0d2" : "#fffe"}`}
            />
            <p
              className={`font-poppins font-semibold text-[14px] ${
                current === "weekly_register"
                  ? "text-[#f6f0d2]"
                  : "text-[#fffe]"
              } `}
            >
              Weekly Register
            </p>
          </div>
        </div>
        <div
          onClick={() => {
            nav("/HR/add_user");
          }}
          className="flex hover:cursor-pointer items-center mb-3"
        >
          <div
            className={`${
              current === "add_user" && "bg-[#ddc764]"
            } mt-4  w-1 h-9`}
          ></div>
          <div className=" p-2 rounded-sm w-[180px]  flex items-center gap-3 mt-4">
            <FontAwesomeIcon
              icon={faUserPlus}
              size="1x"
              color={`${current === "add_user" ? "#f6f0d2" : "#fffe"}`}
            />
            <p
              className={`font-poppins font-semibold text-[14px] ${
                current === "add_user" ? "text-[#f6f0d2]" : "text-[#fffe]"
              } `}
            >
              Add User
            </p>
          </div>
        </div>
        <div
          onClick={() => {
            nav("/HR/platform_add");
          }}
          className="flex hover:cursor-pointer items-center mb-3"
        >
          <div
            className={`${
              current === "platform_user" && "bg-[#ddc764]"
            } mt-4  w-1 h-9`}
          ></div>
          <div className=" p-2 rounded-sm w-[180px]  flex items-center gap-3 mt-4">
            <FontAwesomeIcon
              icon={faPlusMinus}
              size="1x"
              color={`${current === "platform_user" ? "#f6f0d2" : "#fffe"}`}
            />
            <p
              className={`font-poppins font-semibold text-[14px] ${
                current === "platform_user" ? "text-[#f6f0d2]" : "text-[#fffe]"
              } `}
            >
              Platform Users
            </p>
          </div>
        </div>

        <div className="flex hover:cursor-pointer items-center mb-4">
          <div
            onClick={() => {
              log_out(nav);
            }}
            className=" p-2 rounded-sm w-[180px]  flex items-center gap-3 mt-4"
          >
            <FontAwesomeIcon icon={faDoorOpen} size="1x" color="white" />
            <p className="font-poppins font-semibold text-[14px]  text-white">
              Exit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
