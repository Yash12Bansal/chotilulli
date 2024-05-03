"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ThemeSwitch from "../components/ThemeSwitch";
import axios from "axios";
import TypePractice from "../components/TypePractice";

// async function postUserDetails() {
//   // const /response = await axios.get("https://api.ipify.org/?format=json");
//   console.log("THIS IS THE ENV URL11  ", process.env.NEXT_PUBLIC_URL);

//   try{
//     const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user`);
//     // const res = await response.json();
//     return response.data;

//   }
//   catch(e){
//     console.log(e);
//   }
// }
export default function Home() {
  const [data, setData] = useState(null);
  useEffect(() => {
    try {
      axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user`).then((res) => {
        console.log("new data   d  ", res.data);
        setData(res.data);
      });
      // const res = await response.json();
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div>
      <div></div>
      <div>{data != null && <TypePractice res={data} />}</div>
    </div>
  );
}
