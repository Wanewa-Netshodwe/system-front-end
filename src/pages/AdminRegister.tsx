import React, {  useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SideMenuBarHR from "../components/SideMenuBarHR";
import "./table.css";

import axios from "axios";

import {
  faRightToBracket,
  faSearch,
  faFileExport,
  faRightLeft,
} from "@fortawesome/free-solid-svg-icons";
import { pdf } from "@react-pdf/renderer";
import MyDocument from "./RegisterPDF";
import { saveAs } from "file-saver";
import SideMenuBar from "../components/SideMenuBar";
type Props = {};

export const generatePDF = async (register: { [key: string]: boolean[] }) => {
  const blob = await pdf(<MyDocument register={register} />).toBlob();
  saveAs(blob, `${new Date().toDateString()}_weekly_register.pdf`);
};

export default function AddToPlatform({}: Props) {
  const fetch_data = async () => {
    const res = await axios.get("http://localhost:3001/api/hr/reportregister");
    const data = res.data.register;
    setRegister(data);
  };
  useEffect(() => {
    const load_data = async () => {
      await fetch_data();
    };
    load_data();
  }, []);
  const now = new Date();
  const startOfWeek = new Date();
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);
  const diff_days = now.getDay() - startOfWeek.getDay() + 1;
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const temp_arr = Array.from({ length: diff_days }).fill(1);
  const [register, setRegister] = useState<{ [key: string]: boolean[] }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const items_per_page = 10;
  const pages_i = Math.round(Object.entries(register).length / items_per_page);
  const pages = Array.from({ length: pages_i }).fill(1);
  const idx_last = currentPage * items_per_page;
  const first_index = idx_last - items_per_page;

  return (
    <div className="w-[100vw] z-10 h-[120%] flex bg-[#3A4C4F]">
      <SideMenuBarHR current="weekly_register" />
      <div className=" rounded-tl-xl bg-[#F8F7F1]  p-5 w-full flex-2">
        <div className="items-center justify-between flex">
          <p className=" text-[30px]  font-poppins font-semibold">
            Weekly Register
            <span className="text-[17px]  ml-2  font-poppins ">
              {new Date().toDateString()}
            </span>
          </p>
          <div>
            <button
              onClick={() => {
                generatePDF(register);
              }}
              className="w-[99px] bg-[#1D9BF0] text-white focus:outline-none p-1 h-[30px]
                      font-poppins text-[12px] rounded-md
                      border-[#a4c3e3]"
            >
              Export
              <FontAwesomeIcon icon={faFileExport} size="1x" color="white" />
            </button>
          </div>
        </div>
        <table cellPadding={10} className="mt-8">
          <thead>
            <th className="w-[200px]"></th>
            { temp_arr.length >5 ? temp_arr.slice(0,5).map((_, idx) => {
              return <th className="w-[200px] ">{weekdays[idx]}</th>;
            }) :temp_arr.map((_, idx) => {
              return <th className="w-[200px] ">{weekdays[idx]}</th>;
            }) }
          </thead>
          <tbody>
            {Object.keys(register)
              .slice(first_index, idx_last)
              .map((key) => {
                return (
                  <tr key={key}>
                    <td className="text-[14px] font-bold font-poppins">
                      {key}
                    </td>
                    {register[key as keyof typeof register].slice(0,5).map(
                      (value, index) => {
                        return (
                          <td
                            className="text-center text-[14px]  font-poppins"
                            key={index}
                          >
                            {value ? "Present" : "Absent"}
                          </td>
                        );
                      }
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div className="mt-4 ">
          <div className="flex gap-2  w-[96%] justify-end ">
            {pages.length > 1 &&
              pages.map((_, idx) => {
                return (
                  <button
                    onClick={() => {
                      setCurrentPage(idx + 1);
                    }}
                    className={`p-1  rounded-md w-[40px] ${
                      idx + 1 === currentPage ? "bg-[#3A4C4F]" : "bg-white "
                    }
            ${idx + 1 === currentPage ? "text-white" : "text-[#3A4C4F] "}
            font-poppins font-semibold `}
                  >
                    {idx + 1}
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
