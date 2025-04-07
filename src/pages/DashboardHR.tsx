import React, { useEffect, useState } from "react";
import { faUserGroup, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import AnimatedNumbers from "react-animated-numbers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SideMenuBarHR from "../components/SideMenuBarHR";
import WeekModal from "../components/WeekModal";
import { GenerateAvator } from "../utils/GenerateAvator";
import { GenerateInitials } from "../utils/GenerateInitials";
import "./table.css";
import HRDashboardLoader from "../components/HRDashboardLoader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  setAllattendance,
  setHRattendanceData,
  UserAttendance,
} from "../redux/AttendanceSlice";
import { calculateChangeHR, DataChange, isOnTime } from "../utils/Analytics";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import { setHR } from "../redux/UserSlice";
type Props = {};

export default function DashboardHR({}: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [seletectedDate, setselectedDate] = useState<Date>(new Date());
  const [analytics, setAnayltics] = useState<DataChange>();
  const yesterday_rec = useSelector(
    (state: RootState) => state.attendance_data.HR_attendance_data
  );
  const api_key = useSelector(
    (state: RootState) => state.app.api_key
  );
  const all_attendance = useSelector(
    (state: RootState) => state.attendance_data.all_attendance_data
  );
  // console.log("yestaday data  in admin :" + JSON.stringify(yesterday_rec));
  console.log("seleected date in hr :", seletectedDate);
  const [currentPage, setCurrentPage] = useState(1);
  const items_per_page = 5;
  const pages_i = Math.round(yesterday_rec.length / items_per_page);
  const pages = Array.from({ length: pages_i }).fill(1);
  const idx_last = currentPage * items_per_page;
  const first_index = idx_last - items_per_page;
  const current_rows = yesterday_rec.slice(first_index, idx_last);

  const determineRec = (
    map: Record<string, UserAttendance[]>,
    selected: Date
  ) => {
    const selected_start = new Date(selected);
    selected_start.setHours(0, 0, 0, 0);
    const selected_end = new Date(selected);
    selected_end.setHours(23, 59, 59, 999);
    let day_records: UserAttendance[] = [];
    Object.entries(map).forEach(([key]) => {
      map[key as keyof typeof map].forEach((record) => {
        const recordDate = new Date(record.todayDate);

        if (recordDate >= selected_start && recordDate <= selected_end) {
          day_records.push(record);
        }
      });
    });
    const yesterdayStart = new Date(selected);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);

    let yesterday_records: UserAttendance[] = [];

    Object.entries(map).forEach(([key]) => {
      map[key].forEach((record) => {
        const recordDate = new Date(record.todayDate);
        if (recordDate >= yesterdayStart && recordDate <= selected) {
          yesterday_records.push(record);
        }
      });
    });
    // console.log("prev date: " + yesterdayStart);
    // console.log("current date: " + selected);
    // console.log(
    //   "comparing prev " +
    //     JSON.stringify(yesterday_records) +
    //     "and curent :" +
    //     JSON.stringify(day_records)
    // );
    setAnayltics(calculateChangeHR(yesterday_records, day_records));
  };

  useEffect(() => {
    determineRec(all_attendance, seletectedDate);
  }, [seletectedDate]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1300);
  }, []);
  const dispatch = useDispatch();

 const handle_refresh= async()=>{
  setRefresh(true)
  const result = await axios.get(
    "http://localhost:3001/api/hr/reportAttendance",
    {
      headers: { api_key: `${api_key}` },
    }
  );
  if (result.status === 200) {
    dispatch(setHR({ valid: true }));
    const user_data = result.data.users;
    const yesterday_rec = result.data.yesterday_rec;
    dispatch(setAllattendance(user_data));
    console.log("yesstady rec _ " + JSON.stringify(yesterday_rec));
    dispatch(setHRattendanceData(yesterday_rec));
   
 }
 setRefresh(false)
}

  return (
    <div>
      {loading ? (
        <HRDashboardLoader />
      ) : (
        <div className={`w-[100vw] z-10 h-[120%] flex bg-[#3A4C4F]    `}>
          <SideMenuBarHR current="attendance" />

          <div className="rounded-tl-xl bg-[#F8F7F1]  p-5 w-full flex-2 ">
            <div className="flex items-center  gap-6">
              <p className="font-poppins font-semibold text-[20px]">
                Attendance
              </p>
              <div onClick={handle_refresh} className="flex cursor-pointer p-2 border-2 border-green-950 rounded-full ">
                { refresh ? <Spinner/> : 
                  <FontAwesomeIcon icon={faRotateRight}  className="size-[20px] text-green-800"/>}
              </div>
            </div>

            <div className="mt-3 flex gap-3">
              <div
                className={`p-4 flex flex-col gap-3  w-[260px] rounded-md bg-[#d5eada]`}
              >
                <div>
                  <FontAwesomeIcon
                    icon={faUserGroup}
                    color={`  ${
                      analytics?.changes.attendance_change!! < 0
                        ? "text-[#d9dada]"
                        : "text-[#3A4C4F]"
                    }`}
                  />
                </div>
                <div>
                  <p
                    className={`text-[20px] font-poppins font-semibold "text-[#3A4C4F] `}
                  >
                    {analytics?.total_records_current} Students
                  </p>
                </div>
              </div>

              <div
                className={`p-4 flex flex-col gap-3  w-[260px] rounded-md  ${
                  analytics?.changes.attendance_change!! < 0
                    ? "bg-[#f18b8b]"
                    : "bg-[#d5eada]"
                }`}
              >
                <div>
                  <FontAwesomeIcon
                    icon={faUserGroup}
                    color={`  ${
                      analytics?.changes.attendance_change!! < 0
                        ? "text-[#d9dada]"
                        : "text-[#3A4C4F]"
                    }`}
                  />
                </div>
                <div>
                  <p
                    className={`text-[20px] font-poppins font-semibold  ${
                      analytics?.changes.attendance_change!! < 0
                        ? "text-[#d9dada]"
                        : "text-[#3A4C4F]"
                    } `}
                  >
                    {analytics?.total_records_current!! -
                      analytics?.total_records_prev!! >
                    0
                      ? 0
                      : analytics?.total_records_current!! -
                        analytics?.total_records_prev!!}{" "}
                    Absent
                  </p>
                </div>
              </div>

              <div
                className={`p-4 flex flex-col gap-3  w-[260px] rounded-md  ${
                  analytics?.changes.ontime_perc_change!! < 0
                    ? "bg-[#f18b8b]"
                    : "bg-[#d5eada]"
                }`}
              >
                <div>
                  <FontAwesomeIcon
                    icon={faUserGroup}
                    color={`  ${
                      analytics?.changes.ontime_perc_change!! < 0
                        ? "text-[#d9dada]"
                        : "text-[#3A4C4F]"
                    }`}
                  />
                </div>
                <div>
                  <p
                    className={`text-[20px] font-poppins font-semibold  ${
                      analytics?.changes.ontime_perc_change!! < 0
                        ? "text-[#d9dada]"
                        : "text-[#3A4C4F]"
                    } `}
                  >
                    {analytics?.changes.ontime_perc_change!! < 0
                      ? " 0"
                      : analytics?.changes.ontime_perc_change!!}
                    <span
                      className={` text-[16px]   ${
                        analytics?.changes.ontime_perc_change!! < 0
                          ? "text-[#d9dada]"
                          : "text-[#3A4C4F]"
                      } font-poppins font-semibold`}
                    >
                      % onTime
                    </span>
                  </p>
                </div>
              </div>

              <div
                className={`p-4 flex flex-col gap-3  w-[260px] rounded-md  ${
                  analytics?.changes.late_perc_change!! < 0
                    ? "bg-[#d5eada]"
                    : "bg-[#f18b8b]"
                }`}
              >
                <div>
                  <FontAwesomeIcon
                    icon={faUserGroup}
                    color={` ${
                      analytics?.changes.late_perc_change!! < 0
                        ? "#3A4C4F"
                        : "#d9dada"
                    }`}
                  />
                </div>
                <div>
                  <p
                    className={`text-[20px] font-poppins font-semibold  ${
                      analytics?.changes.late_perc_change!! < 0
                        ? "text-[#3A4C4F]"
                        : "text-[#d9dada]"
                    } `}
                  >
                    {analytics?.changes.late_perc_change!! < 0
                      ? " 0"
                      : analytics?.changes.late_perc_change!!}
                    <span
                      className={` text-[16px]   ${
                        analytics?.changes.late_perc_change!! < 0
                          ? "text-[#3A4C4F]"
                          : "text-[#d9dada]"
                      } font-poppins font-semibold`}
                    >
                      % Late
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <WeekModal setselectedDate={setselectedDate} />

            <table cellPadding="10" cellSpacing={"50"} className="mt-8 ">
              <thead className="p-1">
                <th className="w-[350px]">
                  <p className=" text-start font-poppins font-semibold">
                    Employee Name
                  </p>
                </th>
                <th className="w-[420px]">
                  <p className=" text-start font-poppins font-semibold">
                    clock-in && clock-out
                  </p>
                </th>
                <th className="w-[300px]">
                  <p className=" text-start font-poppins font-semibold">
                    Email Address
                  </p>
                </th>
                <th className="w-[200px]">
                  <p className=" text-start font-poppins font-semibold">Role</p>
                </th>
              </thead>
              <tbody>
                {current_rows.length > 0 ? (
                  current_rows.map((val) => {
                    // console.log(
                    //   "value in the current rows table : " + JSON.stringify(val)
                    // );
                    return (
                      <tr
                        onClick={() =>
                          navigate("/HR/student", {
                            state: {
                              fullname: `${val.user.first_name} ${val.user.last_name}`,
                              data_map: all_attendance,
                            },
                          })
                        }
                        className=" hover:cursor-pointer rounded-lg "
                      >
                        <td>
                          <div className=" gap-3 flex w-[180px] items-center right-0">
                            <img
                              src={val.user.profile_pic}
                              className="w-[30px] h-[30px] rounded-full"
                              alt="imagek"
                            />

                            <p className="font-poppins font-semibold mt-[1px]">
                              {GenerateInitials(
                                `${val.user.first_name} ${val.user.last_name}`
                              )}
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-5">
                            <p
                              className={`font-poppins font-semibold ${
                                !isOnTime(new Date(val.clock_in)) &&
                                "text-red-500"
                              } text-[14px]`}
                            >
                              {String(
                                new Date(val.clock_in).getHours()
                              ).padStart(2, "0")}
                              H
                              {String(
                                new Date(val.clock_in).getMinutes()
                              ).padStart(2, "0")}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                <div className="bg-gray-400 h-3 w-3 rounded-full"></div>
                                <div className="bg-gray-400 h-1 w-8 "></div>
                              </div>
                              <span className="font-poppins text-[11px] text-gray-400">
                                {val.clock_out
                                  ? `${String(val.work_hours.hours).padStart(
                                      2,
                                      "0"
                                    )} : 
                              ${String(val.work_hours.minutes).padStart(
                                2,
                                "0"
                              )} : 
                              ${String(val.work_hours.seconds).padStart(2, "0")}
                              `
                                  : "not clocked out"}
                              </span>
                              <div className="flex items-center">
                                <div className="bg-gray-400 h-1 w-8 "></div>
                                <div className="bg-gray-400 h-3 w-3 rounded-full"></div>
                              </div>
                            </div>
                            <p className="font-poppins font-semibold text-[14px]">
                              {val.clock_out
                                ? `  ${String(
                                    new Date(val.clock_out).getHours()
                                  ).padStart(2, "0")}H
                            ${String(
                              new Date(val.clock_out).getMinutes()
                            ).padStart(2, "0")}`
                                : "not clocked out"}
                            </p>
                          </div>
                        </td>
                        <td>
                          <p className="font-poppins font-semibold text-[14px]">
                            {val.user.email}
                          </p>
                        </td>
                        <td>
                          <p className="font-poppins font-semibold text-[14px]">
                            {val.user.job}
                          </p>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <p className="font-poppins font-semibold text-[16px]">
                    {" "}
                    No data found{" "}
                  </p>
                )}
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
      )}
    </div>
  );
}
