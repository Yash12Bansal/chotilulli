// import os from "os";
// import crypto from "crypto";
// import { PrismaClient } from "@prisma/client";
// import { NextRequest, NextResponse } from "next/server";
// // Function to retrieve MAC address
// function getMacAddress() {
//   // Get network interfaces
//   const interfaces = os.networkInterfaces();

//   // Loop through interfaces to find the MAC address
//   for (const interfaceName in interfaces) {
//     const interfaceInfo = interfaces[interfaceName];
//     if (interfaceInfo) {
//       for (let info of interfaceInfo) {
//         if (!info.internal && info.mac) {
//           return info.mac;
//         }
//       }
//     }
//   }
//   // If MAC address not found, return a default value
//   return "unknown";
// }

// // Function to generate a unique identifier based on MAC address and additional attributes
// function generateUniqueId() {
//   const macAddress = getMacAddress();
//   // const cpuId = os.cpus()[0].model;
//   // CPU ID
//   // const motherboardSerial = "some_serial";
//   // Motherboard serial number (if available)

//   // Combine MAC address, CPU ID, and motherboard serial number
//   // -${motherboardSerial}
//   // -${cpuId}
//   const combinedData = `${macAddress}`;

//   // Hash the combined data using SHA-256
//   const hashedData = crypto
//     .createHash("sha256")
//     .update(combinedData)
//     .digest("hex");

//   return hashedData;

//   // return Response.json({
//   //   id: hashedData,
//   // });
// }
// function isDifferenceOneDay(date1: Date, date2: Date): boolean {
//   // Remove time component from both dates
//   const strippedDate1 = new Date(
//     date1.getFullYear(),
//     date1.getMonth(),
//     date1.getDate()
//   );
//   const strippedDate2 = new Date(
//     date2.getFullYear(),
//     date2.getMonth(),
//     date2.getDate()
//   );

//   // Calculate the difference in milliseconds
//   const millisecondsDiff = Math.abs(
//     strippedDate2.getTime() - strippedDate1.getTime()
//   );

//   // Convert milliseconds to days
//   const daysDiff = millisecondsDiff / (1000 * 60 * 60 * 24);

//   // Check if the difference is exactly 1 day
//   return daysDiff === 1 || daysDiff === 0;
// }

// export async function GET(req: NextRequest, res: NextResponse) {
//   const prismaClient = new PrismaClient();
//   const sentences = await prismaClient.sentences.findMany({});
//   const index = Math.floor(Math.random() * (2 + 1));

//   const id = await generateUniqueId();
//   const user = await prismaClient.users_non_signed_up.findUnique({
//     where: {
//       user: id,
//     },
//   });
//   if (!user) {
//     const user = await prismaClient.users_non_signed_up.create({
//       data: {
//         user: id,
//         currentStreak: 0,
//         maxStreak: 0,
//         highestWpm: 0,
//         lastPracticeDate: new Date("1990-01-19"),
//       },
//     });
//     return NextResponse.json({ sentence: sentences[index], user: user });

//     // return NextResponse.json(user);
//   } else {
//     const lastPractice = user.lastPracticeDate;
//     const currDate = new Date();

//     const isStreakMaintained = await isDifferenceOneDay(currDate, lastPractice!);
//     let newCurrStreak;
//     if (isStreakMaintained) {
//       return NextResponse.json({ sentence: sentences[index], user: user });
//     } else {
//       newCurrStreak = 0;
//       const newData = {
//         currentStreak: newCurrStreak,
//       };
//       const updatedStats = await prismaClient.users_non_signed_up.update({
//         where: { user: id },
//         data: newData,
//       });
//       console.log("updated stats backendd d d d ",updatedStats);
//       return NextResponse.json({
//         sentence: sentences[index],
//         user: updatedStats,
//       });
//     }

//     // console.log(sentences);
//     // console.log("one sentence  ", sentences[index]);
//   }
// }
