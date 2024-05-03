"use client";
import React, { useState, useEffect } from "react";
import { useStopwatch } from "react-timer-hook";
const Timer = (props: any) => {
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch();

  useEffect(() => {
    console.log("timer  each second dd ......", props.practiceStarted);

    if (props.practiceStarted == 1) {
      console.log("timer  each second dd ...... 222", props.practiceStarted);
      start();
    }
  }, [props.practiceStarted]);
  return (
    <div>
      {/* {minutes}:{seconds} */}
      {isRunning ? (
        <div style={{ fontSize: "1.7rem" }}> {totalSeconds}s</div>
      ) : (
        <div style={{ fontSize: "1.7rem" }}>Start typing to begin</div>
      )}
    </div>
  );
};

export default Timer;
