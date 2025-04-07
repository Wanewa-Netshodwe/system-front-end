import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideMenuBar from "../components/SideMenuBar";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import ClockoutModal from "../components/ClockoutModal";
type Props = {};

export default function Layout({}: Props) {
  const show_modal = useSelector(
    (state: RootState) => state.app.clock_out_modal_open
  );
  return (
    <div className=" min-w-[100vw]">
      {show_modal && <ClockoutModal />}
      <Header />
      <Outlet />
    </div>
  );
}
