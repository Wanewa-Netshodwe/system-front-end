import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideMenuBar from "../components/SideMenuBar";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import ClockoutModal from "../components/ClockoutModal";
import HeaderHR from "../components/HeaderHR";
type Props = {};

export default function LayoutHR({}: Props) {
  return (
    <div className=" min-w-[100vw]">
      <HeaderHR />
      <Outlet />
    </div>
  );
}
