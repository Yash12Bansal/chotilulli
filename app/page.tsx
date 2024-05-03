import Image from "next/image";
import { useRef } from "react";
import ThemeSwitch from "../components/ThemeSwitch";
import axios from "axios";
import TypePractice from "../components/TypePractice";
async function postUserDetails() {
  // const /response = await axios.get("https://api.ipify.org/?format=json");
  console.log("THIS IS THE ENV URL11  ", process.env.NEXT_PUBLIC_URL);

  const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user`);
  // const res = await response.json();
  return response.data;
}
export default async function Home() {
  const res = await postUserDetails();
  console.log("this si the resss", res);
  console.log("this si the resss daata", res.sentence);
  console.log("this si the resss daata", res);

  return (
    <div>
      <div></div>
      <div>
        <TypePractice res={res} />
      </div>
    </div>
  );
}
