import React from "react";
import AccountHolder from "./AccountHolder";

type Props = {};

export default function Header({}: Props) {
  return (
    <div className="justify-between flex p-2">
      <div></div>
      <AccountHolder />
    </div>
  );
}
