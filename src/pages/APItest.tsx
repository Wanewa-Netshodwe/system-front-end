import React, { useState } from "react";
import axios, { Axios } from "axios";
type Props = {};

export default function APItest({}: Props) {
  const [message, setMessage] = useState("");
  const test_success = async () => {
    try {
      const result = await axios.get("http://localhost:8092/api/forbidden");
      if (result.status === 200) {
        setMessage("content ofund okay ");
      } else if (result.status === 404) {
        setMessage("content not found");
      } else if (result.status === 403) {
        setMessage("urforbiddemn");
      }
    } catch (err) {
      if (axios.isAxiosError(err))
        if (err.response && err.response.status === 403) {
          setMessage("urforbiddemn");
        } else {
          console.error("Error:", err.message);
        }
    }
  };
  return (
    <div>
      <h1>API TEST</h1>
      <button onClick={test_success}> test success</button>
      <p>the messsage is {message}</p>
    </div>
  );
}
