import React, { useEffect, useState } from "react";
import SideMenuBar from "../components/SideMenuBar";
import GraphItem from "../components/GraphItem";
import Clock from "react-clock";
import {
  faRightToBracket,
  faRightFromBracket,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import GraphItemHours from "../components/GraphItemHours";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";
import "../components/clock.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "reactjs-popup/dist/index.css";
import { setAppDetails } from "../redux/appSlice";
import { increment, startTimer } from "../redux/timerSlice";
import { setClockin, setUserDetails } from "../redux/UserSlice";
import axios from "axios";
type Props = {};

export default function Dashboard({}: Props) {
  const dispatch = useDispatch();
  const [flag, setFlag] = useState(false);
  const usr = useSelector((state: RootState) => state.user.defaultUser);
  console.log("user metric : ", usr.metrics);
  console.log("user  : ", usr);
  const { time, running } = useSelector((state: RootState) => state.timer);
  useEffect(() => {
    let interval: NodeJS.Timer;
    if (running) {
      interval = setInterval(() => {
        dispatch(increment());
      }, 1000);
    } else {
      //@ts-ignore
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [running, dispatch]);

  const defaultClassNames = getDefaultClassNames();
  const [value, setValue] = useState(new Date());
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setBlocked(false);
    }, 6000);
  }, [blocked]);
  const handelBtnPress = async () => {
    if (clocked_in) {
      dispatch(setAppDetails(true));
    } else {
      try {
        console.log("posting clock in with : ", usr);
        const res = await axios.post(
          "http://192.168.56.2:3001/api/platformUser/clockin",
          usr
        );
    
        if(res.status ===200){
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
                  
          dispatch(setUserDetails(user));
        }
        if (blocked) {
        } else {
          dispatch(startTimer());
          dispatch(setClockin(true));
        }
      } catch (err) {
        if (axios.isAxiosError(err))
          if (err.response?.status === 403) {
            setBlocked(true);
          }
      }
    }
  };
  const isopen = useSelector(
    (state: RootState) => state.app.clock_out_modal_open
  );
  const clocked_in = useSelector(
    (state: RootState) => state.user.defaultUser.clocked_in
  );

  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  function calculateWorkingHoursChangePercentage(
    working_hours_metric: { hours: number; minutes: number; seconds: number },
    current_working_hours: { hours: number; minutes: number; seconds: number }
  ) {
    const workingHoursInSeconds =
      working_hours_metric.hours * 3600 +
      working_hours_metric.minutes * 60 +
      working_hours_metric.seconds;
    const currentWorkingHoursInSeconds =
      current_working_hours.hours * 3600 +
      current_working_hours.minutes * 60 +
      current_working_hours.seconds;
    const changeInSeconds =
      currentWorkingHoursInSeconds - workingHoursInSeconds;
    const percentageChange = (changeInSeconds / workingHoursInSeconds) * 100;
    return percentageChange;
  }

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return (
    <div>
      <div
        className={`w-[100vw] ${
          isopen && "blur-sm"
        } z-10 h-[120%] flex  bg-[#F3F8FB]  border-2`}
      >
        <SideMenuBar current="Dashboard" />

        <div className="border-2 p-5 w-full flex-2 ">
          <div className="flex justify-between w-[95%]">
            <p className="font-poppins text-[20px] font-semibold mb-5  ">
              insights
            </p>
            <div>
              <select
                className=" w-[70px]  text-[#393f45] focus:outline-none pl-2 border-1  h-[30px] border-l-2
             border-t-2  border-b-2 rounded-tl-md rounded-bl-md
             font-poppins text-[14px]
             border-[#a4c3e3]"
              >
                <option className="font-poppins ">
                  {new Date().getFullYear()}
                </option>
              </select>
              <select
                className=" w-[120px] 
             
             border-r-2 rounded-tr-md rounded-br-md
             border-t-2  border-b-2 font-poppins text-[14px]
             text-[#576069] focus:outline-none pl-4  h-[30px] border-1  border-[#a4c3e3]"
              >
                <option className="font-poppins ">
                  {new Date().toLocaleDateString("en-US", { month: "long" })}
                </option>
              </select>
            </div>
          </div>

          <div className="p-2 flex flex-wrap gap-5">
            <GraphItem
              change={usr.metrics.on_time_change}
              dataValues={usr.metrics.on_time_metric_dataset}
              borderColor="#52B623"
              color="#CDFF8C"
              month="February"
              //@ts-ignore
              perc={`${Math.abs(usr.metrics.on_time_change)} %`}
              title="On Time Percentage"
            />
            <GraphItem
              change={usr.metrics.late_change}
              dataValues={usr.metrics.late_metric_dataset}
              borderColor="#F5533D"
              color="#FF9C8E"
              month="February"
              perc={`${Math.abs(usr.metrics.late_change)} %`}
              title="Late Percentage"
            />
            <GraphItemHours
              change={calculateWorkingHoursChangePercentage(
                usr.metrics.working_hours_metric,
                usr.metrics.current_working_hours
              )}
              dataValues={[1]}
              borderColor="#FF7A00"
              color="#FFB37F"
              month={`${new Date().toLocaleDateString("en-US", {
                month: "long",
              })}`}
              hour={`1`}
              minutes={`0`}
              seconds={"0"}
              perc="0"
              title="Total Lunch Hours"
            />
            <GraphItemHours
              change={calculateWorkingHoursChangePercentage(
                usr.metrics.working_hours_metric,
                usr.metrics.current_working_hours
              )}
              dataValues={usr.metrics.working_hours_metric_dataset}
              borderColor="#00BAC8"
              color="#02DEEE"
              month={`${new Date().toLocaleDateString("en-US", {
                month: "long",
              })}`}
              hour={`${usr.metrics.working_hours_metric.hours}`}
              minutes={`${usr.metrics.working_hours_metric.minutes}`}
              seconds={`${usr.metrics.working_hours_metric.seconds}`}
              perc={`${Math.abs(
                calculateWorkingHoursChangePercentage(
                  usr.metrics.working_hours_metric,
                  usr.metrics.current_working_hours
                )
              )}`}
              title="Total Working Hours"
            />
          </div>
          {/* <p className="font-poppins text-[20px] font-semibold mt-3 mb-4 ">
           Announcements
           <span className="font-poppins text-[11px] font-light ">
             {" "}
             Messages will disappear after 24 Hours
           </span>
         </p>
         <Annoucements /> */}
          <p className="font-poppins text-[20px] font-semibold mt-3 mb-4 ">
            Attendance
          </p>

          <div className=" flex gap-3">
            <div className="bg-white p-1 w-[360px] border-2 border-[#C6E6FB] rounded-md">
              <DayPicker
                hideNavigation
                captionLayout="label"
                mode="single"
                timeZone="Africa/Johannesburg"
                classNames={{
                  month_caption:
                    " font-poppins text-[20px] text-center mb-4 font-semibold text-[#2C5B8C]",
                  weekday: "text-[#83ACD8]",
                  day: "font-poppins font-semibold",
                  today: `text-[#83ACD8]`,
                  selected: ` border-2 border-[#83ACD8] text-[#2C5B8C]`,
                  root: `${defaultClassNames.root} shadow-lg p-5`,
                  chevron: `${defaultClassNames.chevron} fill-amber-500`,
                }}
              />
            </div>
            <div className="bg-white flex p-1 w-[860px] border-2 border-[#C6E6FB]  rounded-md">
              <div className="flex-row w-[300px] items-center  mt-10">
                <div className="">
                  <Clock
                    secondHandWidth={2}
                    hourHandWidth={2}
                    minuteHandWidth={1}
                    renderMinuteMarks={false}
                    size={200}
                    value={value}
                  />
                </div>
                <div>
                  <p className="font-poppins text-[35px] mt-4 text-center font-semibold text-[#2C5B8C]">
                    {String(value.getHours()).padStart(2, "0")} :{" "}
                    {String(value.getMinutes()).padStart(2, "0")}:{" "}
                    {String(value.getSeconds()).padStart(2, "0")}
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <div className="flex gap-3">
                  <div>
                    <div className="w-[250px] border-2 p-3 border-[#C6E6FB] h-[85px]  rounded-md mb-4">
                      <p className="font-poppins font-semibold mb-1">
                        Working Hours{" "}
                      </p>
                      <p className="font-poppins  text-[#2C5B8C] text-[21px] font-semibold">
                        {`${hours}`} Hr {`${minutes}`} Mins {`${seconds}`} Secs
                      </p>
                    </div>
                    <div className="w-[250px] border-2 p-3 border-[#C6E6FB] h-[85px]  rounded-md">
                      <p className="font-poppins font-semibold mb-1">
                        Lunch Hours{" "}
                      </p>
                      <p className="font-poppins  text-[#2C5B8C] text-[21px] font-semibold">
                        1 Hr 00 Mins 00 Secs{" "}
                      </p>
                    </div>
                    <div></div>
                  </div>
                  <div>
                    <div className="border-2 p-3 flex flex-col justify-center items-center border-[#C6E6FB] rounded-md">
                      <img
                        src="/pot.png"
                        alt="pot pic"
                        className=" w-[139px] h-[139px] from-[#cc4b4b]"
                      />
                      <p className="font-poppins text-[#66B602] text-[13px] text-center font-semibold">
                        Lost time is never found again
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-2 flex gap-6 items-center mt-8">
                  <div>
                    <FontAwesomeIcon
                      icon={clocked_in ? faRightFromBracket : faRightToBracket}
                      size="2x"
                      color={`${clocked_in ? "#cc4b4b" : "#52B623"}`}
                    />
                  </div>
                  <div>
                    <button
                      onClick={handelBtnPress}
                      className={`font-poppins ${
                        clocked_in
                          ? " bg-gradient-to-r  from-[#d54d4d] via-[#b60232] to-[#d14545] "
                          : " bg-gradient-to-r  from-[#52B623] via-[#66B602] to-[#94D145]"
                      } rounded-md text-white p-1 w-[450px] text-[19px] font-semibold `}
                    >
                      {clocked_in ? "clock-out" : "clock-in"}
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  {blocked && (
                    <p className="font-poppins font-semibold text-[14px] text-[#d54d4d]">
                      already clocked_in for today try tommorow
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
