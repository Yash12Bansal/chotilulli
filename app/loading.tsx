"use client";
import {Spinner} from "@nextui-org/react";
import React from "react";
import Loader from "react-spinners/ClipLoader";


import Loader2 from "react-spinners/RingLoader";
import Loader3 from "react-spinners/RotateLoader";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="flex justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    </div>
  );
}
