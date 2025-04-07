import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAppDetails } from "../redux/appSlice";
import { RootState } from "../redux/store";
import { increment, startTimer, stopTimer } from "../redux/timerSlice";
import { setClockin } from "../redux/UserSlice";
import axios from "axios";

type Props = {};

export default function ClockoutModal({}: Props) {
  const dispatch = useDispatch();
  const usr = useSelector((state: RootState) => state.user);
  const handleCancel = () => {
    dispatch(setAppDetails(false));
  };

  const handleYes = async () => {
    try {
      const result = await axios.post(
        "http://192.168.56.2:3001/api/platformUser/clockout",
        usr.defaultUser
      );
      if (result.status === 200) {
        dispatch(setAppDetails(false));
        dispatch(stopTimer());
        dispatch(setClockin(false));
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="border-[#cce9ff] p-5 items-center  border-2 bg-white top-[300px] rounded-md left-[500px] absolute w-[450px] z-20 h-[250px]">
      <h1 className="font-poppins font-semibold text-[23px]">Clock-out </h1>
      <p className="font-roboto font-light text-[16px] text-[#676767] mt-2">
        Your about to clock-out you wont be able to clock-in <br></br> until the
        next work day{" "}
      </p>
      <p className="font-poppins font-semibold text-[16px] text-[#676767] mt-2">
        Are Sure
      </p>
      <div className="mt-5 flex gap-12">
        <button
          onClick={handleCancel}
          className="font-poppins hover:text-white hover:bg-gray-600 font-semibold text-[16px]  p-2 w-[100px] border-2 border-gray-600 rounded-md "
        >
          Cancel
        </button>
        <button
          onClick={handleYes}
          className="font-poppins hover:text-white hover:bg-green-400 font-semibold text-[16px]  p-2 w-[100px] border-2 border-green-500 rounded-md "
        >
          Yes
        </button>
      </div>
    </div>
  );
}
