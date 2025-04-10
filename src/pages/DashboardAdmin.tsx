import React, { useEffect, useRef, useState } from "react";
import SideMenuBarHR from "../components/SideMenuBarHR";
import "./table.css";
import Papa from "papaparse";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import axios from "axios";
import Spinner from "../components/Spinner";
import { invalid_characters } from "../utils/Quotes";
type Props = {};

//Validators
export const isStudentEmail = (email: string): boolean => {
  return /^[0-9]{9}@tut4life\.ac\.za$/.test(email);
};

export const isStaffEmail = (email: string): boolean => {
  return (
    /^[0-9]{6}@tut\.ac\.za$/.test(email) || /^[a-zA-Z.]+@tut\.ac\.za$/.test(email)
  );
};

export function isValidEmail(email: string, type: string): boolean {
  const studentRegex = /^[0-9]{9}@tut4life\.ac\.za$/;
  const staffRegex = /^[0-9]{6}@tut\.ac\.za$/;
  return type === 'student' ? studentRegex.test(email) : staffRegex.test(email);
}

export function isValidStudentNumber(number: string, type: string): boolean {
  const studentRegex = /^[0-9]{9}$/;
  const staffRegex = /^[0-9]{6}$/;
  return type === 'student' ? studentRegex.test(number) : staffRegex.test(number);
}

export function isValidContact(contact: string): boolean {
  const contactRegex = /^(0[6-8][0-9]{8}|(\+27)[6-8][0-9]{8})$/;
  return contactRegex.test(contact);
}


export default function DashboardAdmin({}: Props) {
  const input_ref = useRef<HTMLInputElement>(null);
  const [first_name, setFirstname] = useState("");
  const [last_name, setLastname] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setShowMessage] = useState(false);
  const [messageall, setShowMessageAll] = useState(false);
  const [messageErrror, setShowErrorMessage] = useState(false);
  const [messageErrrorAll, setShowErrorMessageALL] = useState(false);
  const [valid, setValid] = useState(true);
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [student_num, setStudentNum] = useState("");
  const [gender, setGender] = useState("Male");
  const [role, setRole] = useState("Student");
  const [job, setJob] = useState("Front-End Developer");
  const [filename, setFileName] = useState("");
  const [course, setCourse] = useState("Computer Science");
  const key = useSelector((state: RootState) => state.app.api_key);
  const [api_key, setKey] = useState(key);
  const [csvData, setCsvData] = useState<any[]>([]);
  const clear = () => {
    setContact("");
    setEmail("");
    setLastname("");
    setFirstname("");
    setStudentNum("");
  };
  useEffect(() => {}, []);
  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value.toLowerCase());
  };

  const handleChangeFirstName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      invalid_characters.includes(
        event.target.value.charAt(event.target.value.length - 1)
      )
    ) {
    } else {
      setFirstname(event.target.value.trimStart());

    }
  };
  const handleChangeLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      invalid_characters.includes(
        event.target.value.charAt(event.target.value.length - 1)
      )
    ) {
    } else {
      setLastname(event.target.value);
    }
  };
  const handleChangeStudentNumber = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStudentNum(event.target.value);
  };
  const handleChangeRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
  };
  const handleChangeDepartment = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCourse(event.target.value);
  };
  const handleChangeJob = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setJob(event.target.value);
  };
  const handleChangeGender = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(event.target.value);
  };
  const handleChangeContact = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContact(event.target.value);
    const clean = event.target.value.replace(/[^0-9+]/g, '');
    setContact(clean);
  };
  const v = (str: string) => {
    return str.length < 4;
  };
  

  const is_valid = () => {
    const [errorDetails, setErrorDetails] = useState("");

    if (
      v(first_name) ||
      v(last_name) ||
      v(role) ||
      v(course) ||
      v(job) ||
      v(gender)
    ) {
      setValid(false);
      setErrorDetails("All fields must be filled.");
      return false;
    }
  
    if (!isValidEmail(email, role)) {
      setErrorDetails("Invalid email format for selected role.");
      setValid(false);
      return false;
    }
  
    if (!isValidStudentNumber(student_num, role)) {
      setErrorDetails("Invalid student/staff number length.");
      setValid(false);
      return false;
    }
  
    if (!isValidContact(contact)) {
      setErrorDetails("Invalid contact number. Use SA format (e.g. 076... or +27...).");
      setValid(false);
      return false;
    }
  
    setValid(true);
    setErrorDetails("");
    return true;
  };
  
  const handle_csv_upload = () => {
    input_ref.current?.click();
  };
  const handle_upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const file_name = event.target.files?.[0].name;
    if (file_name) {
      setFileName(file_name);
    }
    if (file) {
      setLoading(true);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: function (results) {
          setCsvData(results.data);
          setLoading(false);
          console.log("Parsed Data:", results.data);
        },
        error: function (error) {
          console.error("Error parsing CSV:", error);
          setLoading(false);
        },
      });
    }
  };
  const addUser = async () => {
    if (is_valid()) {
      let obj = {
        job: job,
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone_number: contact,
        student_number: student_num,
        gender: gender,
        role: role,
        course: course,
      };
      let data = {
        user: obj,
      };
      try {
        const res = await axios.post(
          "http://192.168.56.2:3001/api/users/create",
          data,
          {
            headers: { api_key: api_key },
          }
        );
        if (res.status === 200) {
          clear();
          setShowMessage(true);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.status === 409) {
            setShowErrorMessage(true);
          }
        }
      }
    }
  };
  const addUsers = async () => {
    if (csvData.length > 0) {
      let users = [];

      for (let i = 0; i < csvData.length; i++) {
        let obj = {
          job: csvData[i].Job,
          first_name: csvData[i].firstName,
          last_name: csvData[i].lastName,
          email: csvData[i].Email,
          phone_number: "0" + csvData[i].ContactNo,
          student_number: csvData[i].studentNumber,
          gender: csvData[i].Gender,
          role: csvData[i].Role,
          course: csvData[i].Course,
        };
        users.push(obj);
      }
      let data = {
        user_data: users,
      };
      try {
        const res = await axios.post(
          "http://192.168.56.2:3001/api/users/createAll",
          data,
          {
            headers: { api_key: api_key },
          }
        );
        console.log("res status :", res.status);

        if (res.status === 200) {
          clear();
          setShowMessageAll(true);
          setCsvData([]);
          setFileName("");
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.status === 409) {
            setCsvData([]);
            setFileName("");
            setShowErrorMessageALL(true);
          }
        }
      }
    }
  };
  useEffect(() => {
    if (!valid) {
      setTimeout(() => {
        setValid(true);
      }, 2000);
    }
    if (message) {
      setTimeout(() => {
        setShowMessage(false);
      }, 2000);
    }
    if (messageall) {
      setTimeout(() => {
        setShowMessageAll(false);
      }, 2000);
    }
  }, [message, valid, messageall]);
  return (
    <div className="w-[100vw] z-10 h-[120%] flex bg-[#3A4C4F]">
      <SideMenuBarHR current="add_user" />
      <div className="rounded-tl-xl bg-[#F8F7F1]  p-5 w-full flex-2">
        <p className=" text-[25px]  font-poppins font-semibold">Add User</p>
        {!valid && (
          <p className="text-[15px] text-red-700 text-red font-poppins">
            all details are required
          </p>
        )}
        <div className=" flex gap-16 mb-3">
          <div className="mt-5 ">
            <p className="font-poppins font-semibold text-[15px]">First Name</p>
            <input
              placeholder="First Name "
              value={first_name}
              onChange={handleChangeFirstName}
              className="mt-1 placeholder:text-[#124e27] placeholder:font-poppins
                pl-2 font-poppins text-[#124e27] rounded-md
                placeholder:pl-2 focus:outline-none
              w-[250px] h-[35px] border-2 border-[#124e27]"
              type="text"
            ></input>
          </div>

          <div className="mt-5 ">
            <p className="font-poppins font-semibold text-[15px]">Last Name</p>
            <input
              onChange={handleChangeLastName}
              value={last_name}
              placeholder="Last Name "
              className="mt-1 placeholder:text-[#124e27] placeholder:font-poppins
                pl-2 font-poppins text-[#124e27]
                placeholder:pl-2 focus:outline-none rounded-md
              w-[250px] h-[35px] border-2 border-[#124e27]"
              type="text"
            ></input>
          </div>

          <div className="mt-5 ">
            <p className="font-poppins font-semibold text-[15px]">
              Student Number
            </p>
            <input
              onChange={handleChangeStudentNumber}
              value={student_num}
              placeholder="Last Name "
              className="mt-1 placeholder:text-[#124e27] placeholder:font-poppins
                pl-2 font-poppins text-[#124e27]
                placeholder:pl-2 focus:outline-none rounded-md
              w-[250px] h-[35px] border-2 border-[#124e27]"
              type="text"
            ></input>
          </div>
        </div>
        <div className=" flex gap-16 mb-3">
          <div className="mt-5 ">
            <p className="font-poppins font-semibold text-[15px]">Contact No</p>
            <input
              value={contact}
              onChange={handleChangeContact}
              placeholder="Contact Number "
              className="mt-1 placeholder:text-[#124e27] placeholder:font-poppins
                pl-2 font-poppins text-[#124e27]
                placeholder:pl-2 focus:outline-none rounded-md
              w-[250px] h-[35px] border-2 border-[#124e27]"
              type="number"
            ></input>
          </div>

          <div className="mt-5 ">
            <p className="font-poppins font-semibold text-[15px]">Gender</p>

            <select
              onChange={handleChangeGender}
              className=" w-[250px]  text-[#124e27] focus:outline-none pl-2  h-[35px] border-2 rounded-md border-[#124e27]"
            >
              <option className="font-poppins ">Male</option>
              <option className="font-poppins">Female</option>
            </select>
          </div>
          <div className="mt-5 ">
            <p className="font-poppins font-semibold text-[15px]">Role</p>

            <select
              onChange={handleChangeRole}
              className=" w-[250px]  text-[#124e27] focus:outline-none pl-2  h-[35px] border-2 rounded-md border-[#124e27]"
            >
              <option className="font-poppins ">Student</option>
            </select>
          </div>
        </div>
        <div className=" flex gap-16 mb-3">
          <div className="mt-5 ">
            <p className="font-poppins font-semibold text-[15px]">Email</p>
            <input
              placeholder="Student Email "
              value={email}
              onChange={handleChangeEmail}
              className="mt-1 placeholder:text-[#124e27] placeholder:font-poppins
                pl-2 font-poppins text-[#124e27] rounded-md
                placeholder:pl-2 focus:outline-none
              w-[565px] h-[35px] border-2 border-[#124e27]"
              type="email"
            ></input>
          </div>

          <div className="mt-5 ">
            <p className="font-poppins font-semibold text-[15px]">Course</p>
            <select
              onChange={handleChangeDepartment}
              className=" w-[250px]  text-[#124e27] focus:outline-none pl-2  h-[35px] border-2 rounded-md border-[#124e27]"
            >
              <option className="font-poppins ">Computer Science</option>
              <option className="font-poppins">Infomation Technolgy</option>
              <option className="font-poppins">Infomatics</option>
              <option className="font-poppins">Multimedia Computing</option>
              <option className="font-poppins">N/A</option>
            </select>
          </div>
          <div className="mt-5 ">
            <p className="font-poppins font-semibold text-[15px]">Job</p>
            <select
              onChange={handleChangeJob}
              className=" w-[250px]  text-[#124e27] focus:outline-none pl-2  h-[35px] border-2 rounded-md border-[#124e27]"
            >
              <option className="font-poppins ">Front-End Developer</option>
              <option className="font-poppins">Back-End Developer</option>
              <option className="font-poppins">UI/UX Designer</option>
              <option className="font-poppins">Fullstack Developer</option>
              <option className="font-poppins">Business Analyst</option>
              <option className="font-poppins">IT Technician</option>
            </select>
          </div>
        </div>
        <div className="flex gap-6  mt-9 items-center ">
          <button
            onClick={addUser}
            className=" gap-3 bg-[#124e27] hover:bg-[#197238] items-center flex justify-center font-poppins text-white  w-[125px] p-2  rounded-sm "
          >
            {" "}
            add user
            {loading && <Spinner color="green" />}
          </button>
          {message && (
            <p className="font-poppins text-[14px] text-green-500  ">
              added user to database
            </p>
          )}
          {messageErrror && (
            <p className="font-poppins  text-red-700  ">
              Error Duplicates Detected
            </p>
          )}
        </div>
        <h2 className=" mt-10 font-poppins text-[23px]  font-semibold">
          Add Multiple Students by uploading a csv File
        </h2>
        <p className="text-gray-400 font-poppins  ">
          for the csv to be correctly parsed the first row has to have the
          following inputs
        </p>
        <img src="http://192.168.56.2:3001/csv_info.png" alt="" />
        <div className="items-center flex gap-3">
          <button
            onClick={handle_csv_upload}
            className="mt-7  gap-3 bg-[#124e27] hover:bg-[#197238] items-center flex justify-center font-poppins text-white  w-[125px] p-2  rounded-sm "
          >
            upload Csv
            {loading && <Spinner color="green" />}
          </button>
          <p className=" text-center font-poppins text-[14px] font-semibold">
            {filename}
          </p>
          <button
            onClick={addUsers}
            className="mt-7 gap-3 bg-[#124e27] hover:bg-[#197238] items-center flex justify-center font-poppins text-white  w-[125px] p-2  rounded-sm "
          >
            add Users
          </button>
          {messageall && (
            <p className="font-poppins  text-green-500  ">
              all users added to database
            </p>
          )}
          {messageErrrorAll && (
            <p className="font-poppins  text-red-700  ">
              Error Duplicates Detected
            </p>
          )}
        </div>

        <input
          onChange={handle_upload}
          ref={input_ref}
          type="file"
          accept=".csv"
          hidden
        ></input>
      </div>
    </div>
  );
}
function setErrorDetails(arg0: string) {
  throw new Error("Function not implemented.");
}

