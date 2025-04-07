import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideMenuBarHR from "../components/SideMenuBarHR";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserAttendance } from "../redux/AttendanceSlice";
import { GenerateAvator } from "../utils/GenerateAvator";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  calculateDashBoardAnalyticMonthly,
  onTimeData,
} from "../utils/Analytics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: false,
  maintainAspectRatio: false,
  plugins: {
    tooltip: { enabled: true },
    legend: {
      position: "bottom" as const,
      display: true,
    },
  },
  scales: {
    x: {
      display: true,
    },
    y: {
      display: false,
    },
  },
};
const weekDays = ["Mon", "Tue", "Wed", "Thur", "Fri"];
const labels = [...Array.from({ length: 5 }).map((v, i) => weekDays[i])];

type Props = {};

export default function UserAccount({}: Props) {
  const location = useLocation();
  const full_name = location.state.fullname;
  const data_map: Record<string, UserAttendance[]> = location.state.data_map;
  const my_data: UserAttendance[] = data_map[full_name];
  console.log(data_map);
  console.log(full_name);
  console.log(my_data);
  const navigate = useNavigate();
  const my_datasets = onTimeData(my_data);

  function getWeekdaysInMonth(): number {
    const now = new Date();
    const daysInMonth = now.getDate();
    let weekdays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(now.getFullYear(), now.getMonth() + 1, day);
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        weekdays++;
      }
    }

    return weekdays;
  }
  const data = {
    labels,
    datasets: [
      {
        label: "Late",
        data: my_datasets.lateData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "OnTime",
        data: my_datasets.earlyData,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  console.log(" On Time  Data set :" , my_datasets.earlyData);
  console.log(" Late Data set :" , my_datasets);
  console.log(" Data set :" , my_datasets);

  return (
    <div className={`w-[100vw] z-10 h-[120%] flex bg-[#3A4C4F]    `}>
      <SideMenuBarHR current="Dashboard" />
      <div className="rounded-tl-xl bg-[#F8F7F1]  p-5 w-full flex-2 ">
        <div
          onClick={() => navigate("/HR/Dashboard")}
          className="mt-2 mb-3 hover:cursor-pointer w-[70px] flex items-center gap-2 "
        >
          <FontAwesomeIcon icon={faArrowLeft} color="#3A4C4F" size="1x" />
          <p className="font-poppins font-semibold text-[15px] text-[#192a1cee]">
            Back
          </p>
        </div>
        <div className=" flex  gap-36">
          <div>
            <div className="mt-2">
              <p className="font-poppins font-semibold text-[20px] text-[#333333ee]">
                Personal Details
              </p>
            </div>
            <div className="mt-2">
              <div className="  w-[470px] flex gap-2">
                <div className=" w-[180px]  rounded-sm">
                  <img
                    className="w-[180px]  rounded-sm"
                    src={
                      my_data[0].user.profile_pic
                        ? my_data[0].user.profile_pic
                        : GenerateAvator(full_name)
                    }
                    alt="profile_pic"
                  />
                </div>
                <div className="pt-5">
                  <div className="mb-1">
                    <p className="font-poppins text-green-800 text-[15px]  font-semibold">
                      Name
                    </p>
                    <p className="font-poppins text-gray-700 text-[13px] font-semibold">
                      {full_name}
                    </p>
                  </div>
                  <div className="mb-1">
                    <p className="font-poppins text-green-800 text-[15px] font-semibold">
                      gender
                    </p>
                    <p className="font-poppins text-gray-700 text-[13px] font-semibold">
                      {my_data[0].user.gender}
                    </p>
                  </div>
                  <div className="mb-1">
                    <p className="font-poppins text-green-800 text-[15px] font-semibold">
                      Student Number
                    </p>
                    <p className="font-poppins text-gray-700 text-[13px] font-semibold">
                      {my_data[0].user.student_number}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 w-[310px] flex justify-between">
              <p className="font-poppins font-semibold text-[15px] text-[#333333ee]">
                Department
              </p>
              <p className="font-poppins font-semibold text-[15px] text-[#333333ee]">
                Contact Details
              </p>
            </div>
            <div className="">
              <div className="w-[470px] flex gap-16">
                <div className="pt-5">
                  <div className="mb-1">
                    <p className="font-poppins text-green-800 text-[15px]  font-semibold">
                      Department
                    </p>
                    <p className="font-poppins text-gray-700 text-[13px] font-semibold">
                      {my_data[0].user.course}
                    </p>
                  </div>
                  <div className="mb-1">
                    <p className="font-poppins text-green-800 text-[15px] font-semibold">
                      Role
                    </p>
                    <p className="font-poppins text-gray-700 text-[13px] font-semibold">
                      {my_data[0].user.job}
                    </p>
                  </div>
                </div>
                <div className="pt-5">
                  <div className="mb-1">
                    <p className="font-poppins text-green-800 text-[15px]  font-semibold">
                      Phone Number
                    </p>
                    <p className="font-poppins text-gray-700 text-[13px] font-semibold">
                      {my_data[0].user.phone_number}
                    </p>
                  </div>
                  <div className="mb-1">
                    <p className="font-poppins text-green-800 text-[15px] font-semibold">
                      Email Address
                    </p>
                    <p className="font-poppins text-gray-700 text-[13px] font-semibold">
                      {my_data[0].user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <p className="font-poppins text-green-800 text-[15px] font-semibold">
                Joined
              </p>
              <p className="font-poppins text-gray-700 text-[13px] font-semibold">
                {new Date(my_data[0].user.createdAt).toDateString()}
              </p>
            </div>
            <div className="mt-5">
              <p className="font-poppins text-green-800 text-[17px] font-semibold">
                Number Of Days At Work{" "}
                <span className="font-poppins text-gray-600 text-[17px] font-semibold">
                  ({new Date().toLocaleString("en-US", { month: "long" })})
                </span>
              </p>
              <p className="font-poppins text-gray-700 text-[17px] font-semibold">
                {my_data.length}
              </p>
            </div>
            <div className="mt-5">
              <p className="font-poppins text-green-800 text-[17px] font-semibold">
                Absent Days{" "}
                <span className="font-poppins text-gray-600 text-[17px] font-semibold">
                  ({new Date().toLocaleString("en-US", { month: "long" })})
                </span>
              </p>
              <p className="font-poppins text-red-500 text-[17px] font-semibold">
                {Math.abs(my_data.length - getWeekdaysInMonth())}
              </p>
            </div>
          </div>
          <div>
            <div className="mt-2 mb-2">
              <p className="font-poppins font-semibold text-[20px] text-[#333333ee]">
                Daily Clockin Infomation
              </p>
            </div>
            <Line width={400} height={250} options={options} data={data} />;
          </div>
        </div>
      </div>
    </div>
  );
}
