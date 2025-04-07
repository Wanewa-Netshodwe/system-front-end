import React from "react";

type Props = {
  color?: string;
};

export default function Spinner({ color = "blue" }: Props) {
  return (
    <div
      className="animate-spin rounded-full border-white  w-4 h-4 border-4 "
      style={{
        borderTopColor: color,
      }}
    ></div>
  );
}
