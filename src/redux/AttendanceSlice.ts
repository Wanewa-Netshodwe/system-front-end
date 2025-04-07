import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "./UserSlice";
type workHours = {
  hours: number;
  minutes: number;
  seconds: number;
};

export type AttendanceData = {
  clock_in: Date;
  clock_out: Date | null;
  todayDate: Date;
  workHours: workHours;
  valid: boolean;
};
export type UserAttendance = {
  id?: number;
  clock_in: Date;
  clock_out?: Date;
  todayDate: Date;
  user: UserState;
  work_hours: {
    hours: number;
    seconds: number;
    minutes: number;
  };
};
const my_attendance_data: Map<string, AttendanceData[]> = new Map();
const all_attendance_data: Record<string, UserAttendance[]> = {};
const my_attendance_data_daily: Map<string, AttendanceData> = new Map();
const HR_attendance_data: UserAttendance[] = [];
const initialState = {
  all_attendance_data,
  my_attendance_data,
  my_attendance_data_daily,
  HR_attendance_data,
};
const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setHRattendanceData: (state, action) => {
      state.HR_attendance_data = action.payload;
    },
    setAttendanceData: (state, action) => {
      state.my_attendance_data = action.payload;
    },
    setAttendanceDataDaily: (state, action) => {
      state.my_attendance_data_daily = action.payload;
    },
    setAllattendance: (state, action) => {
      state.all_attendance_data = action.payload;
    },
  },
});
export const {
  setAttendanceData,
  setAttendanceDataDaily,
  setAllattendance,
  setHRattendanceData,
} = attendanceSlice.actions;
export default attendanceSlice.reducer;
