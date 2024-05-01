"use client";
import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { useTheme } from "next-themes";
import Image from "next/image";
import logoDark from "../assets/img/logoDark.png";
import logoLight from "../assets/img/logoLight.png";
import axios from "axios";
import { ChartOptions } from "chart.js";
import nextl from "../assets/img/forward_light.png";
import nextd from "../assets/img/forward_dark.png";
import { useStopwatch } from "react-timer-hook";
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  ChartData,
} from "chart.js";

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);

export default async function Stats(props:any){
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  async function updateStats(wpm:Number) {
    // const /response = await axios.get("https://api.ipify.org/?format=json");
    const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/updateStats`,{
      wpm:wpm
    });
    console.log("my response after updating stats", response.data.message);
    return response;
  
  }
  
  // useEffect(() => {
  //   console.log("This is stats componet use effect call");
  //   const handleResize = () => {
  //     setWindowSize({
  //       width: window.innerWidth,
  //       height: window.innerHeight,
  //     });
  //   };

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);
  const [listWpm, setListWpm] = useState<number[]>([]);
  const [listGrossWpm, setListGrossWpm] = useState<number[]>([]);
  const [listLabels, setListLabels] = useState<string[]>([]);
  // const listIncorrectCharsEachSecond = useRef<number[]>([]);
  const { setTheme, resolvedTheme } = useTheme();

  const l1 = useRef<number[]>([]);
  const l2 = useRef<number[]>([]);
  const l3 = useRef<string[]>([]);

  const data: ChartData<"line", number[], string> = {
    labels: listLabels,
    datasets: [
      {
        label: "net wpm",
        fill: false,
        backgroundColor: "rgba(0,0,0,0.4)",
        borderColor: "rgba(0,0,0,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(0,0,0,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(0,0,0,1)",
        pointHoverBorderColor: "rgba(0,0,0,1)",
        pointHoverBorderWidth: 3,
        pointRadius: 3,
        pointHitRadius: 10,
        data: listWpm,
      },
      {
        label: "gross wpm",
        fill: false,
        backgroundColor: "rgb(110, 110, 110)",
        borderColor: "rgb(110, 110, 110)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgb(110, 110, 110)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgb(110, 110, 110)",
        pointHoverBorderColor: "rgb(110, 110, 110)",
        pointHoverBorderWidth: 3,
        pointRadius: 3,
        pointHitRadius: 10,
        data: listGrossWpm,
      },
    ],
  };
  const options: ChartOptions<"line"> = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Adjust tick options here
          autoSkip: true,
          maxTicksLimit: 10, // Adjust as needed
        },
      },
    },
  };
  useEffect(() => {
    if (l1.current.length == 0) {
      console.log(
        "this is list in error called1",
        props.listIncorrectCharsEachSecond.length
      );

      for (let i in props.listIncorrectCharsEachSecond) {
        console.log(
          "each iterations stats differnece ",
          props.listTotal[i] - props.listIncorrectCharsEachSecond[i]
        );
        l3.current.push((parseInt(i, 10) + 1).toString());
        // && props.listTotal[i] - props.listIncorrectCharsEachSecond[i] >= 3

        if (props.listCorrectWordsEachSecond[i] >= 1) {
          l1.current.push(
            (props.listTotal[i] - props.listIncorrectCharsEachSecond[i]) /
              5 /
              ((parseInt(i, 10) + 1) / 60)
          );
        } else {
          l1.current.push(0);
        }
        l2.current.push(props.listTotal[i] / 5 / ((parseInt(i, 10) + 1) / 60));
      }

      setListGrossWpm(l2.current);
      setListWpm(l1.current);
      setListLabels(l3.current);
    
      const res= updateStats(Math.floor(l1.current[l1.current.length - 1]));
    }
  }, []);
  return (
    <div className="outmost-stats-page-div">
      <div
        className={`title ${
          resolvedTheme === "dark" ? "title-dark" : "title-light"
        }`}
      >
        <div>
          <p style={{ display: "inline" }}> cH</p>
          {resolvedTheme === "light" ? (
            <Image
              alt=""
              style={{ display: "inline", marginTop: "-13px" }}
              src={logoLight}
              width={50}
              height={50}
            />
          ) : (
            <Image
              alt=""
              style={{ display: "inline", marginTop: "-13px" }}
              src={logoDark}
              width={50}
              height={50}
            />
          )}
          <p style={{ display: "inline" }}>Ti LUllI</p>
        </div>
      </div>

      <div className="div-stats">
        <div className="each-stat-div">
          <div className="each-stat-title golden-style">gross wpm</div>
          <div className="each-stat-data">
            {Math.floor(listGrossWpm[listGrossWpm.length - 1])}
          </div>
        </div>

        <div className="each-stat-div">
          <div className="each-stat-title golden-style">net wpm</div>
          <div className="each-stat-data">
            {Math.floor(listWpm[listWpm.length - 1])}
          </div>
        </div>

        <div className="each-stat-div">
          <div className="each-stat-title golden-style">accuracy</div>
          <div className="each-stat-data">
            {Math.floor(
              ((props.total - props.incorrectAccuracy) / props.total) * 100
            )}
            %
          </div>
        </div>
      </div>
      <div className="graph-div-outer">
        <div className="graph-div">
          <Line data={data} options={options} />
        </div>
      </div>
      <div className="next-button-div">
        <span className="next-button-span" onClick={props.loadNewSentence}>
          Continue to next
          {/* {resolvedTheme === "light" ? (

            <Image alt="" src={nextl} width={35} height={35} />
          ) : (
            <Image alt="" src={nextd} width={35} height={35} />
          )} */}
        </span>
      </div>
    </div>
  );
};

