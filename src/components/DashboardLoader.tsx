import React, { useEffect, useState } from "react";
import SideMenuBar from "./SideMenuBar";
import GraphItem from "./GraphItem";
import Clock from "react-clock";
import {
  faRightToBracket,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import GraphItemHours from "./GraphItemHours";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";
import "../components/clock.css";
import AnimatedNumbers from "react-animated-numbers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "reactjs-popup/dist/index.css";
import { setAppDetails } from "../redux/appSlice";
import { increment, startTimer } from "../redux/timerSlice";
import { setClockin } from "../redux/UserSlice";
import axios from "axios";
import { useAttendanceAnalytics } from "../utils/CalculateAnalytic";
import {
  AttendanceData,
  setAttendanceData,
  setAttendanceDataDaily,
} from "../redux/AttendanceSlice";
import { calculateDashBoardAnalyticDaily } from "../utils/Analytics";
type Props = {};

export default function DashboardLoader({}: Props) {
  return (
    <div className={`w-[100vw]  z-10 h-[150%] flex    bg-[#F3F8FB]  border-2`}>
      <SideMenuBar current="Dashboard" />

      <div className="border-2 p-5 w-full flex-2 ">
        <div className="flex h-[40px] justify-between w-[95%]">
          <div className=" w-[140px] border-2  h-[40px] bg-[#d3d8dd]  animate-pulse  "></div>
        </div>

        <div className="p-2 flex flex-wrap gap-5">
          <div className="border-2 h-[180px] bg-[#d3d8dd]  animate-pulse  p-5 w-[250px]  rounded-md"></div>
          <div className="border-2 h-[180px] bg-[#d3d8dd]  animate-pulse  p-5 w-[300px]  rounded-md"></div>
          <div className="border-2 h-[180px] bg-[#d3d8dd]  animate-pulse p-5 w-[300px]  rounded-md"></div>
          <div className="border-2 h-[180px] bg-[#d3d8dd]  animate-pulse p-5 w-[300px]  rounded-md"></div>
        </div>
        {/* <p className="font-poppins text-[20px] font-semibold mt-3 mb-4 ">
          Announcements
          <span className="font-poppins text-[11px] font-light ">
            {" "}
            Messages will disappear after 24 Hours
          </span>
        </p>
        <Annoucements /> */}
         <div className=" w-[140px]  border-2 h-[40px] bg-[#d3d8dd]  animate-pulse mt-3 mb-4   "></div>

        <div className=" flex gap-3">
          <div className="bg-[#d3d8dd]  animate-pulse p-1 w-[360px] h-[350px] border-2 rounded-md">
            
          </div>
          <div className=" flex p-1 animate-pulse w-[860px] bg-[#d3d8dd]    rounded-md">
            <div className="flex-row w-[350px] items-center  mt-10">
              <div className=""></div>
              <div></div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
