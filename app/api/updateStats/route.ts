import os from "os";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Fab } from "@mui/material";

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
  const combinedData = `${macAddress}`;

  // Hash the combined data using SHA-256
  const hashedData = crypto
    .createHash("sha256")
    .update(combinedData)
    .digest("hex");

  return hashedData;
}
function isDifferenceOneDay(date1: Date, date2: Date[]): number {
  // Remove time component from both dates
  let f = 0;
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
    if (daysDiff === 0) {
      f = 1;
      break;
    }
  }
  if (f == 1) {
    return f;
  } else {
    for (let i of date2) {
      const strippedDate2 = new Date(
        i.getFullYear(),
        i.getMonth(),
        i.getDate()
      );

      // Calculate the difference in milliseconds
      const millisecondsDiff = Math.abs(
        strippedDate2.getTime() - strippedDate1.getTime()
      );

      // Convert milliseconds to days
      const daysDiff = millisecondsDiff / (1000 * 60 * 60 * 24);

      // Check if the difference is exactly 1 day
      if (daysDiff === 1) {
        f = 2;
        break;
      }
    }
    return f;
  }
}

// async function updateRecordWithUniqueDate(currDate: Date) {
//   try {
//     // Assuming you have a model called YourModel
//     let record = await prisma.yourModel.findFirst();
//     if (!record) {
//       console.error("Record not found.");
//       return;
//     }

//     // Remove time part from the current date
//     const currentDateWithoutTime = new Date(currDate.toISOString().split('T')[0]);

//     // Check if the date already exists in the practiceDates array
//     const isDateAlreadyPresent = record.practiceDates.some(date => date.toISOString().split('T')[0] === currentDateWithoutTime.toISOString().split('T')[0]);

//     // If the date doesn't already exist, push the new date to the array
//     if (!isDateAlreadyPresent) {
//       record = await prismaClient.yourModel.update({
//         where: {
//           id: record.id
//         },
//         data: {
//           practiceDates: {
//             push: currentDateWithoutTime
//           }
//         }
//       });
//       console.log("Updated record with new date:", record);
//     } else {
//       console.log("Date already exists in the record.");
//     }
//   } catch (error) {
//     console.error("Error updating record:", error);
//   }
//   // finally {
//   //   await prisma.$disconnect();
//   // }
// }

export async function POST(req: NextRequest, res: NextResponse) {
  const prismaClient = new PrismaClient();
  const { wpm } = await req.json();

  const id = await generateUniqueId();
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

    // return NextResponse.json(user);
  } else {
    const newWpm = Math.max(user.highestWpm, wpm);
    // const currDate = new Date();
    const currentDateUTC = new Date();

    // Get the timezone offset in milliseconds
    const timezoneOffsetMs = new Date().getTimezoneOffset() * 60000;

    // Adjust the date by adding the timezone offset
    const currDate = new Date(currentDateUTC.getTime() - timezoneOffsetMs);

    let newCurrStreak;
    let newMaxStreak;
    const isStreakMaintained = isDifferenceOneDay(currDate, user.practiceDates);

    if (isStreakMaintained === 2) {
      newCurrStreak = user.currentStreak + 1;
    } else if (isStreakMaintained === 1) {
      newCurrStreak = user.currentStreak;
    } else {
      newCurrStreak = 1;
    }

    newMaxStreak = Math.max(user.maxStreak, newCurrStreak);
    const newData = {
      currentStreak: newCurrStreak,
      maxStreak: newMaxStreak,
      highestWpm: newWpm,
    };
    const updatedStats = await prismaClient.users_non_signed_up.update({
      where: { user: id },
      data: newData,
    });

    const currentDateWithoutTime = new Date(
      currDate.toISOString().split("T")[0]
    );
    // Get the current date and time in UTC

    console.log("curr date", currentDateWithoutTime);
    console.log("curr date2", currDate);
    // console.log("curr date3", localDate);

    let record;
    // Check if the date already exists in the practiceDates array
    const isDateAlreadyPresent = user.practiceDates.some((date) => {
      console.log(
        "loop ",
        date.toISOString().split("T")[0],
        currentDateWithoutTime.toISOString().split("T")[0]
      );

      return (
        date.toISOString().split("T")[0] ===
        currentDateWithoutTime.toISOString().split("T")[0]
      );
    });

    // If the date doesn't already exist, push the new date to the array
    if (!isDateAlreadyPresent) {
      record = await prismaClient.users_non_signed_up.update({
        where: {
          user: id,
        },
        data: {
          practiceDates: {
            push: currentDateWithoutTime,
          },
        },
      });
      console.log("Updated record with new date:", record);
    } else {
      console.log("Date already exists in the record.");
    }

    // return  NextResponse.json({sentence: sentences[index],user:user});
  }
  return NextResponse.json({ message: "success" });
}
