"use client";
import React, { useRef } from "react";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import ThemeSwitch from "./ThemeSwitch";
import Timer from "./Timer";
import Stats from "./Stats";
import contact from "../assets/img/contact.png";
import terms from "../assets/img/note.png";
import lock from "../assets/img/unlock.png";
import { useTheme } from "next-themes";
import wpmf from "../assets/img/wpm.png";
import fire from "../assets/img/fire.png";
import fire2 from "../assets/img/fire2.png";
import wpm2 from "../assets/img/firewall2.png";
import loop2 from "../assets/img/currStreak.png";
import restartL from "../assets/img/reload_light.png";
import restartD from "../assets/img/reload_dark.png";
import loop from "../assets/img/currStreak.png";
import Image from "next/image";
import logoDark from "../assets/img/logoDark.png";
import logoLight from "../assets/img/logoLight.png";
import { Prosto_One } from "next/font/google";

const Motto = (props: any) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <>
      <div className="real">
        <div
          className={`${
            resolvedTheme === "dark"
              ? "div-title-motto-dark"
              : "div-title-motto-light"
          }`}
        >
          <div className="div-title">
            <div className="title-motto">
              <div>
                <p style={{ display: "inline" }}> cH</p>
                {resolvedTheme === "dark" ? (
                  <Image
                    alt=""
                    style={{ display: "inline", marginTop: "-13px" }}
                    src={logoDark}
                    width={50}
                    height={50}
                  />
                ) : (
                  <Image
                    alt=""
                    style={{ display: "inline", marginTop: "-13px" }}
                    src={logoLight}
                    width={50}
                    height={50}
                  />
                )}
                <p style={{ display: "inline" }}>Ti LUllI</p>
                {/* <div>The Ultimate place</div> */}
              </div>
            </div>
          </div>
          <div className="div-motto">
            <div className="motto-inside-divs-quote">
              " Coders who don't know touch typing are not coders. "
            </div>
            <div className="motto-inside-divs-quote">
              " They are <span className="title-span">chOTi lUlli</span> coders.
              "
            </div>
            <div className="motto-inside-divs-name">- Elon Musk</div>
          </div>
          <div className="div-motto2">
            <div className="motto-inside-divs">
              Maintain your streak without signing up.
            </div>
            <div className="motto-inside-divs">
              The only website with this feature.
            </div>
          </div>

          <div className="div-got-it">
            <button className="button-got-it" onClick={props.gotItClick}>
              got it
            </button>
          </div>
        </div>
      </div>

      <div className="outmost-div-motto"></div>
    </>
  );
};
export default Motto;
