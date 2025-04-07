import React, { useEffect, useState } from "react";
import { faUserGroup, faSearch } from "@fortawesome/free-solid-svg-icons";
import AnimatedNumbers from "react-animated-numbers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SideMenuBarHR from "../components/SideMenuBarHR";
import WeekModal from "../components/WeekModal";
import { GenerateAvator } from "../utils/GenerateAvator";
import { GenerateInitials } from "../utils/GenerateInitials";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";

type Props = {};

export default function HRDashboardLoader({}: Props) {
  const WEEKDAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  const [selected, setSelected] = useState(today.getDate());
  const startOfWeek = new Date(today);

  startOfWeek.setDate(today.getDate() - today.getDay());

  const daysInThisWeek: number[] = [];

  for (let i = -7; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    daysInThisWeek.push(date.getDate());
  }

  type week_day_render = { day: number; weekday: string };
  const list: week_day_render[] = [];

  for (let i = 0; i < daysInThisWeek.length; i++) {
    list.push({
      day: daysInThisWeek[i],
      weekday: WEEKDAYS[i % 7],
    });
  }

  const itemsPerPage = 7;
  const [index, setIndex] = useState(list.length - itemsPerPage);
  const currentItems = list.slice(index, index + itemsPerPage);
  return (
    <div className={`w-[100vw] z-10 h-[120%] flex bg-[#3A4C4F]    `}>
      <SideMenuBarHR current="Dashboard" />

      <div className="rounded-tl-xl bg-[#F8F7F1]  p-5 w-full flex-2 ">
        <p className="font-poppins font-semibold text-[20px]">Attendance</p>

        <div className="mt-3 flex gap-3">
          <div className="p-4 flex flex-col gap-3  animate-pulse h-[90px] w-[260px] rounded-md bg-[#535453]"></div>
          <div className="p-4 flex flex-col gap-3  animate-pulse w-[260px] rounded-md bg-[#535453]"></div>

          <div className="p-4 flex flex-col gap-3 animate-pulse  w-[260px] rounded-md bg-[#535453]"></div>

          <div className="p-4 flex flex-col gap-3 animate-pulse  w-[260px] rounded-md bg-[#535453]"></div>
        </div>

        <div className="mt-8 flex gap-3 text-center">
          <div className="p-1 animate-pulse bg-[#535453]  h-[40px] mt-1 w-[35px] rounded-md flex justify-center items-center "></div>
          <div className=" flex gap-2 w-[1050px] animate-pulse  p-1  rounded-md  overflow-hidden">
            <AnimatePresence>
              {currentItems.map((val, idx) => (
                <motion.div
                  key={`${val.day}-${val.weekday}`}
                  initial={{ opacity: 0.5, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0.5, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`p-2   rounded-md w-[395px] h-[40px] bg-[#535453]  items-center`}
                ></motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="p-1 bg-[#535453]  animate-pulse h-[40px] mt-1 w-[35px] rounded-md flex justify-center items-center "></div>
        </div>

        <div className=" animate-pulse mt-5 w-[250px] h-[40px] bg-[#535453]  relative"></div>

        <table cellPadding="10" cellSpacing={"50"} className="mt-8 ">
          <thead className="p-1">
            <th className="w-[350px] animate-pulse h-[40px] bg-[#535453]"></th>
            <th className="w-[450px] animate-pulse h-[40px] bg-[#535453]"></th>
            <th className="w-[430px] animate-pulse h-[40px] bg-[#535453]"></th>
          </thead>
          <tbody>
            <tr className="  rounded-lg ">
              <td>
                <div className="bg-[#535453] animate-pulse h-[40px] gap-3 flex w-[180px] items-center right-0"></div>
              </td>
              <td>
                <div className="flex items-center animate-pulse bg-[#535453] h-[40px] gap-5"></div>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
