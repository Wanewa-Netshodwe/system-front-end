import React, { useEffect, useRef, useState } from "react";
import SideMenuBar from "../components/SideMenuBar";
import { faPen, faLock, faCamera } from "@fortawesome/free-solid-svg-icons";
import "react-day-picker/style.css";
import "../components/clock.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GenerateAvator } from "../utils/GenerateAvator";
import Spinner from "../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { increment } from "../redux/timerSlice";
import axios from "axios";
import { private_user, UserState } from "../redux/UserSlice";
import PayslipPDF from "./PayslipPDF";
import { pdf } from "@react-pdf/renderer";
import MyDocument from "./RegisterPDF";
import { saveAs } from "file-saver";
type Props = {};
export const generatePDF = async (user: UserState, hours: number) => {
  const blob = await pdf(
    <PayslipPDF
      email={`${user.email}`}
      full_name={`${user.first_name} ${user.last_name}`}
      student_number={`${user.student_number}`}
      hours={hours}
      phone_number={`${user.phone_number}`}
    />
  ).toBlob();
  saveAs(blob, `${new Date().toDateString()}_payslip.pdf`);
};
export default function MyAccount({}: Props) {
  const usr = useSelector((state: RootState) => state.user);
  console.log("usr in my account page " + Object.entries(usr));
  const [image, setImage] = useState("");
  const [file, setFile] = useState("");
  const [total_hours, setTotalHours] = useState(0);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
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
  const handleClick = () => {
    //@ts-ignore
    fileInputRef.current.click();
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      let i = URL.createObjectURL(file);
      setImage(i);
      setFile(file);
    }
  };
  const upload = async (formData: FormData) => {
    try {
      console.log("sending request");
      const response = await axios.post(
        "http://localhost:3001/api/platformUser/upload",
        formData
      );

      if (response.status === 200) {
        console.log(response.data);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  useEffect(() => {
    if (image.length > 5) {
      const upload_image = async () => {
        const formData = new FormData();
        formData.append("profile_pic", file);
        formData.append("user", JSON.stringify(usr.defaultUser));
        await upload(formData);
      };
      upload_image();
    }
  }, [image]);
  console.log("file " + image);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const get_total_hours = async () => {
    // if (total_hours === 0) {
    //   generatePDF(usr.defaultUser, total_hours);
    // } else {
      let obj = {
        user_id: usr.defaultUser.id,
      };
      const res = await axios.post(
        "http://localhost:3001/api/platformUser/monthdata",
        obj
      );
      if (res.status === 200) {
        const hours = res.data.hours;
        setTotalHours(hours);
        generatePDF(usr.defaultUser, hours);
      
    }
  };

  return (
    <div className="w-[100vw] h-[120%] flex  bg-[#F3F8FB] border-2">
      <SideMenuBar current="MyAccount" />

      <div className="border-2 p-5 w-full flex-2 ">
        <div className="mt-8 h-[725px] w-[1150px]   bg-white shadow-[#5A91CB] shadow-sm border-2 border-[#a4c3e3] rounded-md">
          <div className="relative">
            <div className="w-full  flex items-center  justify-end bg-[#AAD9F9] h-[100px]"></div>
            <div className="absolute top-3 left-[467px]">
              <div className="border-4 relative border-white flex flex-col items-center justify-center w-[160px] rounded-full p-2 ">
                <img
                  src={image.length > 2 ? image : usr.defaultUser.profile_pic}
                  className="w-[140px] h-[140px]  rounded-full"
                  alt="ii"
                />

                <div className="bg-gray-700  -bottom-10 p-2 h-[60px] w-[60px] items-center justify-center flex   absolute rounded-full">
                  <input
                    name="profile_pic"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                  <FontAwesomeIcon
                    onClick={handleClick}
                    className="hover:cursor-pointer"
                    icon={faCamera}
                    size="2x"
                    color="white"
                  />
                </div>
                <p className="absolute -bottom-20 font-poppins  text-center text-[#7e7e7e] text-[18px] font-semibold w-[580px]">
                  {usr.defaultUser.first_name} {usr.defaultUser.last_name}
                </p>

                <p className="absolute -bottom-[110px] font-poppins  text-center text-[#8e7e7e] text-[15px] font-semibold w-[580px]">
                  {usr.defaultUser.job}
                </p>
              </div>
            </div>
            <div className="  h-[600px]  p-44 pl-48">
              <p className="font-poppins  text-[19px] w-[720px] font-semibold  ">
                Account Details
                <hr className="mt-2 border-1 border-[#83ACD8]"></hr>
              </p>
              <div className="mt-4 flex gap-5">
                <div className="w-[350px]">
                  <p className="text-[#83ACD8] font-poppins ">First Name</p>

                  <p className=" font-poppins  ">
                    {usr.defaultUser.first_name}
                  </p>
                </div>
                <div className="w-[350px]">
                  <p className="text-[#83ACD8] font-poppins ">Last Name</p>

                  <p className=" font-poppins  ">{usr.defaultUser.last_name}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-5">
                <div className="w-[350px]">
                  <p className="text-[#83ACD8] font-poppins ">Contact number</p>

                  <p className=" font-poppins  ">
                    {usr.defaultUser.phone_number}
                  </p>
                </div>
                <div className="w-[350px]">
                  <p className="text-[#83ACD8] font-poppins ">Gender</p>

                  <p className=" font-poppins  ">{usr.defaultUser.gender}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-5">
                <div className="w-[350px]">
                  <p className="text-[#83ACD8] font-poppins ">Student Number</p>

                  <p className=" font-poppins  ">
                    {usr.defaultUser.student_number}
                  </p>
                </div>
                <div className="w-[350px]">
                  <p className="text-[#83ACD8] font-poppins ">Email</p>

                  <p className=" font-poppins  ">{usr.defaultUser.email}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-5">
                <div className="w-[350px]">
                  <p className="text-[#83ACD8] font-poppins ">Join Date</p>
                  <p className=" font-poppins  ">
                    {`${new Date().toLocaleDateString("en-US", {
                      day: "2-digit",
                    })}/${new Date().toLocaleDateString("en-US", {
                      month: "long",
                    })}/${new Date().getFullYear()}`}
                  </p>
                </div>
                <div className="w-[350px]">
                  <button
                    onClick={async () => {
                      await get_total_hours();
                    }}
                    className="font-poppins w-[130px] p-2 font-semibold text-[16px] bg-blue-400 hover:bg-blue-500 text-white"
                  >
                    Payslip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
