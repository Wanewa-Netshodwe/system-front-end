import React, { act, useEffect, useState } from "react";

import {
  faUserGroup,
  faRotateRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import AnimatedNumbers from "react-animated-numbers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SideMenuBarHR from "../components/SideMenuBarHR";
import WeekModal from "../components/WeekModal";
import { GenerateAvator } from "../utils/GenerateAvator";
import { GenerateInitials } from "../utils/GenerateInitials";
import "./table.css";

import axios from "axios";
import { private_user } from "../redux/UserSlice";
import Spinner from "../components/Spinner";
type Props = {};

export default function AddToPlatform({}: Props) {
  const [nodataFound, setNoDataFound] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [alldata, setData] = useState<private_user[]>([]);
  const [current_rows, setCurrentRows] = useState<private_user[]>([]);
  const [search, setSearch] = useState("");
  console.log("all data : ", alldata);
  useEffect(() => {
    if (alldata.length > 0) {
      setCurrentRows(alldata);
    } else {
      if (!nodataFound) {
        fecth_data();
      }
    }
  }, [alldata]);
  const handle_search = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearch(searchValue);

    if (searchValue.length === 0) {
      setCurrentRows(alldata);
      return;
    }

    const results = alldata
      .map((v) => {
        if (
          v.last_name
            .toLocaleLowerCase()
            .includes(searchValue.toLocaleLowerCase())
        ) {
          return v;
        } else {
          return undefined;
        }
      })
      .filter((v): v is private_user => v !== undefined);
    setCurrentRows(results);
  };

  const fecth_data = async () => {
    try {
      const res = await axios.get("http://192.168.56.2:3001/api/HR/get");
      if (res.status === 200) {
        if (res.data.users.length === 0) {
          setNoDataFound(true);
          setData(res.data.users);
        } else {
          setNoDataFound(false);
          setData(res.data.users);
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.status === 403) {
          //todo
        }
      }
    }
  };
  useEffect(() => {
    fecth_data();
  }, []);

  const handle_delete = async (user: private_user) => {
    let obj = {
      user: user,
    };
    try {
      const res = await axios.post(
        "http://192.168.56.2:3001/api/HR/remove",
        obj
      );
      if (res.status === 200) {
        console.log("delete");
        setData([]);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.status === 403) {
          //todo
        }
      }
    }
  };

  const handle_btn_click = async (user: private_user, action: string) => {
    if (action === "add") {
      let obj = {
        user: user,
      };
      try {
        const res = await axios.post(
          "http://192.168.56.2:3001/api/HR/add",
          obj
        );
        if (res.status === 200) {
          setData([]);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.status === 403) {
            //todo
          }
        }
      }
    } else {
      let obj = {
        user: user,
      };
      try {
        const res = await axios.post(
          "http://192.168.56.2:3001/api/HR/del",
          obj
        );
        if (res.status === 200) {
          setData([]);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.status === 403) {
            //todo
          }
        }
      }
    }
  };
  const handle_refresh = async () => {
    setRefresh(true);
    try {
      const res = await axios.get("http://192.168.56.2:3001/api/HR/get");
      if (res.status === 200) {
        if (res.data.users.length === 0) {
          setNoDataFound(true);
          setData(res.data.users);
        } else {
          setNoDataFound(false);
          setData(res.data.users);
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.status === 403) {
          //todo
        }
      }

     
    }
    setRefresh(false);
  };

  return (
    <div className={`w-[100vw] z-10 h-[120%] flex  bg-[#3A4C4F]`}>
      <SideMenuBarHR current="platform_user" />
      <div className=" rounded-tl-xl bg-[#F8F7F1]  p-5 w-full flex-2 ">
        <div className="flex justify-between items-center ">
          <div className="flex items-center  gap-6">
            <p className=" text-[25px]  font-poppins font-semibold">
              Register Students{" "}
              <span className="font-poppins text-[12px]">to platform</span>
            </p>
            <div
              onClick={handle_refresh}
              className="flex cursor-pointer p-2 border-2 border-green-950 rounded-full "
            >
              {refresh ? (
                <Spinner color="green" />
              ) : (
                <FontAwesomeIcon
                  icon={faRotateRight}
                  className="size-[20px] text-green-800"
                />
              )}
            </div>
          </div>

          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="size-[20px] absolute left-[5px] text-green-800 top-[22px] "
            />
            <input
              value={search}
              onChange={handle_search}
              type="text"
              placeholder="Student LastName"
              className="p-2 pl-8 w-[230px] bg-transparent font-poppins placeholder:font-poppins text-green-700 placeholder:text-green-800  rounded-md border-0 focus:outline-none  mt-3"
            />
          </div>
        </div>

        <table cellPadding="10" cellSpacing={"50"} className="mt-5 ">
          <thead className="p-1">
            <th className="w-[300px]">
              <p className=" text-[15px] text-start font-poppins font-semibold">
                Employee Name
              </p>
            </th>
            <th className="w-[340px]">
              <p className=" text-[15px] text-start font-poppins font-semibold">
                student number
              </p>
            </th>
            <th className="w-[300px]">
              <p className="  text-[15px] text-start font-poppins font-semibold">
                Email Address
              </p>
            </th>
            <th className="w-[200px]">
              <p className=" text-[15px] text-start font-poppins font-semibold">
                Role
              </p>
            </th>
            <th className="w-[200px]">
              <p className=" text-[15px]  text-start font-poppins font-semibold">
                Course
              </p>
            </th>
            <th className="w-[200px]">
              <p className=" text-[15px]  text-start font-poppins font-semibold">
                Added To Platform
              </p>
            </th>
            <th className="w-[200px]">
              <p className=" text-[15px]  text-start font-poppins font-semibold">
                Actions
              </p>
            </th>
          </thead>
          <tbody>
            {current_rows.length > 0 ? (
              current_rows.map((val) => {
                return (
                  <tr className="  rounded-lg ">
                    <td>
                      <div className=" gap-3 flex w-[180px] items-center right-0">
                        <img
                          src={val.profile_pic}
                          className="w-[30px] h-[30px] rounded-full"
                          alt="imagek"
                        />

                        <p className="font-poppins font-semibold mt-[1px]">
                          {GenerateInitials(
                            `${val.first_name} ${val.last_name}`
                          )}
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-5">
                        <p
                          className={`font-poppins font-semibold  text-[14px]`}
                        >
                          {val.student_number}
                        </p>
                      </div>
                    </td>
                    <td>
                      <p className="font-poppins font-semibold text-[14px]">
                        {val.email}
                      </p>
                    </td>
                    <td>
                      <p className="font-poppins font-semibold text-[14px]">
                        {val.role}
                      </p>
                    </td>
                    <td>
                      <p className="font-poppins font-semibold text-[14px]">
                        {val.course}
                      </p>
                    </td>
                    <td>
                      <p className="font-poppins font-semibold text-[14px]">
                        {val.added_to_platform ? "Yes" : "No"}
                      </p>
                    </td>
                    <td className=" flex gap-3 ">
                      {val.added_to_platform ? (
                        <button
                          onClick={() => {
                            handle_btn_click(val, "remove");
                          }}
                          className=" text-[12px] hover:bg-gray-200 hover:text-red-600 text-white font-poppins font-semibold w-[80px] p-2 bg-red-500"
                        >
                          remove
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            handle_btn_click(val, "add");
                          }}
                          className=" text-[12px] hover:bg-gray-200 hover:text-green-600 text-white font-poppins font-semibold w-[80px] p-2 bg-green-400"
                        >
                          add
                        </button>
                      )}
                      <button
                        onClick={() => {
                          handle_delete(val);
                        }}
                        className=" text-[12px] hover:bg-gray-200 hover:text-red-700 text-white font-poppins font-semibold w-[80px] p-2 bg-red-600"
                      >
                        Delete
                      </button>

                      <p className="font-poppins font-semibold text-[14px]">
                        {val.added_to_platform}
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
      </div>
    </div>
  );
}
