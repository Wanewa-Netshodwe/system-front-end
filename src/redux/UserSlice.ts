import { createSlice } from "@reduxjs/toolkit";

type HR = {
  valid: boolean;
};
export type private_user = {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  student_number: string;
  phone_number: string;
  role: string;
  course: string;
  gender: string;
  password?: string;
  profile_pic?: string;
  added_to_platform: boolean;
};
export type UserState = {
  id: number;
  last_name: string;
  first_name: string;
  device_id: string;
  role: string;
  surname: string;
  password: string;
  phone_number: string;
  email: string;
  student_number: string;
  gender: string;
  createdAt: string;
  profile_pic: string;
  clocked_in: boolean;
  course: string;
  job: string;
  metrics: {
    on_time_change: number;
    late_change: number;
    on_time_metric_dataset: number[];
    late_metric_dataset: number[];
    working_hours_metric: {
      hours: number;
      minutes: number;
      seconds: number;
    };
    working_hours_metric_dataset: number[];
    current_working_hours: {
      hours: number;
      minutes: number;
      seconds: number;
    };
  };
  attendance_current: Attendance_type | null;
  attendances: Attendance_type[];
};
export type Attendance_type = {
  id?: number;
  clock_in: string;
  clock_out?: string;
  todayDate: string;
  user_id: number;
};
const defaultUser: UserState = {
  id: 0,
  last_name: "",
  first_name: "",
  device_id: "",
  role: "",
  surname: "",
  password: "",
  phone_number: "",
  email: "",
  student_number: "",
  gender: "",
  createdAt: "",
  profile_pic: "",
  clocked_in: false,
  attendance_current: null,
  attendances: [],
  course: "",
  job: "",
  metrics: {
    on_time_change: 0,
    late_change: 0,
    on_time_metric_dataset: [],
    late_metric_dataset: [],
    working_hours_metric: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
    working_hours_metric_dataset: [],
    current_working_hours: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
  },
};

type workHours = {
  hours: number;
  minutes: number;
  seconds: number;
};


const defaultHR: HR = {
  valid: false,
};

const initialState = {
  defaultHR,
  defaultUser,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.defaultUser = action.payload;
    },
    setClockin: (state, action) => {
      state.defaultUser.clocked_in = action.payload;
    },
    setHR: (state, action) => {
      state.defaultHR = action.payload;
    },
  },
});

export const { setUserDetails, setClockin, setHR } = userSlice.actions;

export default userSlice.reducer;
