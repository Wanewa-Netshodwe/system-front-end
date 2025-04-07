import { createSlice } from "@reduxjs/toolkit";

type appState = {
  clock_out_modal_open: boolean;
  api_key: string;
};

const initialState: appState = {
  clock_out_modal_open: false,
  api_key: "",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppDetails: (state, action) => {
      state.clock_out_modal_open = action.payload;
    },
    setAPIKey: (state, action) => {
      state.api_key = action.payload;
    },
  },
});

export const { setAppDetails, setAPIKey } = appSlice.actions;

export default appSlice.reducer;
