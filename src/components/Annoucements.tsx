import React from "react";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
type Props = {};

export default function Annoucements({}: Props) {
  return (
    <div className="bg-white  w-[960px] border-2 border-[#C6E6FB] h-[350px]  rounded-md">
      <div className="p-1">
        <p className="font-poppins mt-3   ml-2 text-[20px] font-semibold">
          {" "}
          Announcements
        </p>
      </div>
      <hr className="mt-3 border-2 border-b-2  border-l-0 border-r-0 border-t-0 border-[#C6E6FB]"></hr>
      <div>
        <div className="p-3 mt-2 flex gap-3 items-center">
          <div>
            <FontAwesomeIcon
              icon={faBell}
              size="2x"
              className="text-[#56B4F4] "
            />
          </div>
          <div>
            <p className="font-poppins text-[15px]  ">
              Employees wo want to pursuing their studies just contact{" "}
            </p>
          </div>
        </div>
        <div className="p-3 -mt-6 ml-9">
          <span className="text-[13px] font-poppins font-light ">
            Apr 25 .{" "}
          </span>
          <span className="text-[13px] font-poppins  font-light ">15H23</span>
        </div>
      </div>
      <div>
        <div className="p-3 mt-2 flex gap-3 items-center">
          <div>
            <FontAwesomeIcon
              icon={faBell}
              size="2x"
              className="text-[#56B4F4] "
            />
          </div>
          <div>
            <p className="font-poppins text-[15px]  ">
              Employees wo want to pursuing their studies just contact{" "}
            </p>
          </div>
        </div>
        <div className="p-3 -mt-6 ml-9">
          <span className="text-[13px] font-poppins font-light ">
            Apr 25 .{" "}
          </span>
          <span className="text-[13px] font-poppins  font-light ">15H23</span>
        </div>
      </div>
    </div>
  );
}
