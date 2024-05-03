"use client";
import React, { useRef } from "react";
import { useState, useMemo, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import logoDark from "../app/assets/img/logoDark.png";
import logoLight from "../app/assets/img/logoLight.png";

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
              Coders who do not know touch typing are not coders.
            </div>
            <div className="motto-inside-divs-quote">
              They are <span className="title-span">chOTi lUlli</span> coders.
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
