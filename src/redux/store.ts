import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./UserSlice";

import appSlice from "./appSlice";
import timerSlice from "./timerSlice";
import attendanceSlice from "./AttendanceSlice";
export const store = configureStore({
  reducer: {
    user: userSlice,
    app: appSlice,
    timer: timerSlice,
    attendance_data: attendanceSlice,
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
