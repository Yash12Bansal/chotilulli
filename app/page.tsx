
import Image from "next/image";
import { useRef } from "react";
import ThemeSwitch from "../components/ThemeSwitch";
import axios from "axios";
import TypePractice from "../components/TypePractice";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import os from "os";
import crypto from "crypto";

async function postUserDetails() {
function getMacAddress() {
  // Get network interfaces
  const interfaces = os.networkInterfaces();

  // Loop through interfaces to find the MAC address
  for (const interfaceName in interfaces) {
    const interfaceInfo = interfaces[interfaceName];
    if (interfaceInfo) {
      for (let info of interfaceInfo) {
        if (!info.internal && info.mac) {
          return info.mac;
        }
      }
    }
  }
  // If MAC address not found, return a default value
  return "unknown";
}

// Function to generate a unique identifier based on MAC address and additional attributes
function generateUniqueId() {
  const macAddress = getMacAddress();
  // const cpuId = os.cpus()[0].model;
  // CPU ID
  // const motherboardSerial = "some_serial";
  // Motherboard serial number (if available)

  // Combine MAC address, CPU ID, and motherboard serial number
  // -${motherboardSerial}
  // -${cpuId}
  const combinedData = `${macAddress}`;

  // Hash the combined data using SHA-256
  const hashedData = crypto
    .createHash("sha256")
    .update(combinedData)
    .digest("hex");

  return hashedData;

  // return Response.json({
  //   id: hashedData,
  // });
}
function isDifferenceOneDay(date1: Date, date2: Date[]): boolean {
  // Remove time component from both dates
  let f = false;
  const strippedDate1 = new Date(
    date1.getFullYear(),
    date1.getMonth(),
    date1.getDate()
  );
  for (let i of date2) {
    const strippedDate2 = new Date(i.getFullYear(), i.getMonth(), i.getDate());

    // Calculate the difference in milliseconds
    const millisecondsDiff = Math.abs(
      strippedDate2.getTime() - strippedDate1.getTime()
    );

    // Convert milliseconds to days
    const daysDiff = millisecondsDiff / (1000 * 60 * 60 * 24);

    // Check if the difference is exactly 1 day
    if (daysDiff === 1 || daysDiff === 0) {
      f = true;
      break;
    }
  }
  if (f) {
    return true;
  }
  return false;
}

  try{
    const prismaClient = new PrismaClient();
    const sentences = await prismaClient.sentences.findMany({});
    const index = Math.floor(Math.random() * sentences.length);
  
    const id = await generateUniqueId();
    // const id= Math.random().toString();
    const user = await prismaClient.users_non_signed_up.findUnique({
      where: {
        user: id,
      },
    });
    if (!user) {
      const user = await prismaClient.users_non_signed_up.create({
        data: {
          user: id,
          currentStreak: 0,
          maxStreak: 0,
          highestWpm: 0,
          practiceDates: [],
        },
      });
      return NextResponse.json({
        sentence: sentences[index],
        user: user,
        newUserCreated: true,
      });
  
      // return NextResponse.json(user);
    } else {
      // const lastPractice = user.lastPracticeDate;
      // const currDate = new Date();
      const currentDateUTC = new Date();
  
      // Get the timezone offset in milliseconds
      const timezoneOffsetMs = new Date().getTimezoneOffset() * 60000;
  
      // Adjust the date by adding the timezone offset
      const currDate = new Date(currentDateUTC.getTime() - timezoneOffsetMs);
  
      const isStreakMaintained = await isDifferenceOneDay(
        currDate,
        user.practiceDates
      );
      let newCurrStreak;
      if (isStreakMaintained) {
        return NextResponse.json({
          sentence: sentences[index],
          user: user,
          newUserCreated: false,
        });
      } else {
        newCurrStreak = 0;
        const newData = {
          currentStreak: newCurrStreak,
        };
        const updatedStats = await prismaClient.users_non_signed_up.update({
          where: { user: id },
          data: newData,
        });
        console.log("updated stats backendd d d d ", updatedStats);
        return NextResponse.json({
          sentence: sentences[index],
          user: updatedStats,
          newUserCreated: false,
        });
      }
  
      // console.log(sentences);
      // console.log("one sentence  ", sentences[index]);
    }
  
  }
  catch(e){
    console.log("YE RAHA MERA EXCEPTION CHAL AB RESOLVE KAR ISSE   ",e);
  }
// Example usage
// const userId = generateUniqueId();
// console.log("User ID:", userId);

// export async function GET(){
// return Response.json({
//     name:"Amsn",
//     email:"exf@gmail.com"
// })
// }
// import { NextApiRequest, NextApiResponse } from "next";
// export async function GET(req: NextApiRequest, res: NextApiResponse) {
//   const ip = req.headers["x-forwarded-for"];
//   res.status(200).json({ ip });
// }

  // console.log("THIS IS THE ENV URL11  ", process.env.NEXT_PUBLIC_URL);

  // try{
  //   const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user`);
  //   // const res = await response.json();
  //   return response.data;
  
  // }
  // catch(e){
  //   console.log("log from the try cathc aa gaya hai  ", e);
  // }
  // return null;
}
export default async function Home() {
  const res = await postUserDetails();
  console.log("this si the resss", res);
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
