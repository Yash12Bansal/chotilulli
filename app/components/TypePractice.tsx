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
import Motto from "./Motto";

const TypePractice = (props: any) => {
  const [userWpm, setUserWpm] = useState(props.res.user.highestWpm);
  const [userCurrentStreak, setUserCurrentStreak] = useState(
    props.res.user.currentStreak
  );
  const [userMaxStreak, setUserMaxStreak] = useState(props.res.user.maxStreak);
  const [showMotto, setShowMotto]=useState(props.res.newUserCreated);
  const [practiceStarted, setPracticeStarted] = useState(0);

  const caretRef = useRef<HTMLSpanElement>(null);
  const currentWordIndexRef = useRef(0);
  const currentCharIndexRef = useRef(0);
  const charRefs = useRef<HTMLDivElement[]>([]);
  const leftPos = useRef(0);
  const wordsRef = useRef<HTMLDivElement>(null);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currSentence, setCurrSentence] = useState(props.res.sentence.sentence);

  const wordRefs = useRef<HTMLDivElement[]>([]);
  const focusRef = useRef<HTMLDivElement>(null);
  const currCharIndexInCharRefs = useRef(0);
  const currCharIndexInCurrentWord = useRef(0);
  const prevCharIndexInCharRefs = useRef(-1);
  const currWordIndexInWordRefs = useRef(0);
  const currWordWrongLettersCount = useRef(0);

  const correctChars = useRef(0);
  const incorrectChars = useRef(0);
  const correctWords = useRef(0);
  const incorrectForAccuracy = useRef(0);
  let intervalId: NodeJS.Timeout;
  const [key, setKey] = useState(0);
  const listIncorrectCharsEachSecond = useRef<number[]>([]);
  const listIncorrectAccuraryCharsEachSecond = useRef<number[]>([]);
  const listCorrectWordsEachSecond = useRef<number[]>([]);
  const listTotal = useRef<number[]>([]);

  const handleMouseMove = (event: any) => {
    if (caretRef.current) {
      if (caretRef.current.classList.contains("fadeInOutAnimation")) {
      } else {
        caretRef.current.classList.add("fadeInOutAnimation");
      }
    }
  };

  const addFocus = (event: any) => {
    event.stopPropagation();

    if (wordsRef.current && wordsRef.current.classList.contains("blurred")) {
      wordsRef.current.classList.remove("blurred");

      focusRef.current?.classList.add("hidden");
    }
  };

  const resetAll = () => {
    currentWordIndexRef.current = 0;
    currentCharIndexRef.current = 0;
    leftPos.current = 0;
    charRefs.current = [];
    wordRefs.current = [];
    currCharIndexInCharRefs.current = 0;
    currCharIndexInCurrentWord.current = 0;
    prevCharIndexInCharRefs.current = -1;
    currWordIndexInWordRefs.current = 0;
    currWordWrongLettersCount.current = 0;

    correctChars.current = 0;
    incorrectChars.current = 0;
    correctWords.current = 0;
    incorrectForAccuracy.current = 0;

    listIncorrectCharsEachSecond.current = [];
    listIncorrectAccuraryCharsEachSecond.current = [];
    listCorrectWordsEachSecond.current = [];
    listTotal.current = [];

    clearInterval(intervalId);
    setPracticeStarted(0);
    setKey(key + 1);
  };

  function loadNewSentence2(event: any) {
    event.stopPropagation();
    resetAll();
  }

  async function loadNewSentence(event: any) {
    event.stopPropagation();
    setShowMotto(false);
    resetAll();

    setCurrSentence("");
    console.log("THIS IS THE ENV URL  ", process.env.NEXT_PUBLIC_URL);

    const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user`);
    console.log("this is the call respo from loadnew sent", response.data);
    setUserWpm(response.data.user.highestWpm);
    setUserCurrentStreak(response.data.user.currentStreak);
    setUserMaxStreak(response.data.user.maxStreak);
    setCurrSentence(response.data.sentence.sentence);
  }

  const removeFocus = () => {
    wordsRef.current?.classList.add("blurred");
    focusRef.current?.classList.remove("hidden");
  };

  const removeFocusOnWindowResize = () => {
    let t3 =
      charRefs.current[currCharIndexInCharRefs.current].offsetTop -
      charRefs.current[0].offsetTop;
    let l1 =
      charRefs.current[currCharIndexInCharRefs.current].offsetLeft -
      charRefs.current[0].offsetLeft +
      2;
    if (caretRef.current) {
      caretRef.current.animate(
        [
          { left: `${l1}px`, top: `${t3}px` }, // Final left position
        ],
        {
          duration: 50, // Animation duration in milliseconds
          iterations: 1, // Number of times the animation should repeat (1 means it will run once)
          fill: "forwards", // Maintain the final state of the animation after it finishes
        }
      );
    }
    wordsRef.current?.classList.add("blurred");
    focusRef.current?.classList.remove("hidden");
  };

  const handleKeyDown3 = (event: any) => {
    if (wordsRef.current && wordsRef.current.classList.contains("blurred")) {
      wordsRef.current.classList.remove("blurred");
      focusRef.current?.classList.add("hidden");
      return;
    }

    const { keyCode } = event;
    const typedChar = event.key;
    const currentCharRef = charRefs.current[currCharIndexInCharRefs.current];
    const previousCharRef = charRefs.current[prevCharIndexInCharRefs.current];
    const element = caretRef.current;

    if (keyCode >= 37 && keyCode <= 40) {
      return;
    }
    if (keyCode >= 112 && keyCode <= 123) {
      return;
    }
    if (
      keyCode === 45 ||
      keyCode === 46 ||
      keyCode === 13 ||
      keyCode === 16 ||
      keyCode === 17 ||
      keyCode === 9 ||
      keyCode === 27 ||
      event.altKey ||
      event.key === "Meta"
    ) {
      return;
    }
    if (practiceStarted == 0) {
      setPracticeStarted(1);
    }

    if (currCharIndexInCharRefs.current < charRefs.current.length) {
      if (currentCharRef.innerText === " " && keyCode !== 8) {
        if (keyCode !== 32) {
          return;
        } else {
          if (currWordWrongLettersCount.current != 0) {
            wordRefs.current[currWordIndexInWordRefs.current].classList.add(
              "error"
            );
          }
          currWordIndexInWordRefs.current += 1;
          currWordWrongLettersCount.current = 0;
          currCharIndexInCurrentWord.current = 0;
        }
      }
    }

    if (keyCode === 8) {
      if (prevCharIndexInCharRefs.current < 0) {
        return;
      }

      if (previousCharRef.innerText == " ") {
        currWordIndexInWordRefs.current -= 1;
        currCharIndexInCurrentWord.current = wordRefs.current.length - 1;

        currWordWrongLettersCount.current =
          wordRefs.current[currWordIndexInWordRefs.current].querySelectorAll(
            ".incorrect-char"
          ).length;
        wordRefs.current[currWordIndexInWordRefs.current].classList.remove(
          "error"
        );
      }
      if (previousCharRef.classList.contains("incorrect-char")) {
        currWordWrongLettersCount.current -= 1;
      }
      previousCharRef.classList.remove("correct-char");
      previousCharRef.classList.remove("correct-char-light");
      previousCharRef.classList.remove("correct-char-dark");

      previousCharRef.classList.remove("incorrect-char");
      if (resolvedTheme === "dark") {
        previousCharRef.classList.add("each-char-dark");
      } else {
        previousCharRef.classList.add("each-char-light");
      }

      if (currentCharIndexRef.current === 0) {
        currentWordIndexRef.current -= 1;
      } else {
        currentCharIndexRef.current -= 1;
      }

      const currCharWidth =
        charRefs.current[prevCharIndexInCharRefs.current].clientWidth;

      currCharIndexInCharRefs.current -= 1;
      let t3 = caretRef.current?.offsetTop;
      if (caretRef.current) {
        if (prevCharIndexInCharRefs.current >= 0) {
          t3 =
            charRefs.current[prevCharIndexInCharRefs.current].offsetTop -
            charRefs.current[0].offsetTop;
        } else {
          ///TODO
        }
      }
      const t4 = charRefs.current[prevCharIndexInCharRefs.current];
      let l1 = caretRef.current?.offsetLeft;
      if (caretRef.current) {
        if (prevCharIndexInCharRefs.current >= 0) {
          l1 =
            charRefs.current[prevCharIndexInCharRefs.current].offsetLeft -
            charRefs.current[0].offsetLeft +
            2;
        } else {
        }
      }

      if (element) {
        caretRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Start the animation
        element.animate(
          [
            { left: `${l1}px`, top: `${t3}px` }, // Final left position
          ],
          {
            duration: 100, // Animation duration in milliseconds
            iterations: 1, // Number of times the animation should repeat (1 means it will run once)
            fill: "forwards", // Maintain the final state of the animation after it finishes
          }
        );
      }
      prevCharIndexInCharRefs.current -= 1;
      currCharIndexInCurrentWord.current -= 1;

      leftPos.current -= currCharWidth;
      return;
    }
    // caretRef.current?.classList.remove("hidden");
    // caretRef.current?.classList.add("caret-pointer");

    if (
      currCharIndexInCharRefs.current >= 0 &&
      currCharIndexInCharRefs.current < charRefs.current.length
    ) {
      if (caretRef.current?.classList.contains("fadeInOutAnimation")) {
        caretRef.current?.classList.remove("fadeInOutAnimation");
      }

      if (currCharIndexInCharRefs.current < charRefs.current.length) {
        if (
          currentCharRef.innerText == typedChar &&
          currentCharRef.innerText !== " "
        ) {
          currentCharRef.classList.add("correct-char");
          currentCharRef.classList.remove("incorrect-char");

          if (resolvedTheme === "dark") {
            currentCharRef.classList.add("correct-char-dark");
            currentCharRef.classList.remove("each-char-dark");
          } else {
            currentCharRef.classList.add("correct-char-light");
            currentCharRef.classList.remove("each-char-light");
          }
        } else if (currentCharRef.innerText != typedChar) {
          currentCharRef.classList.remove("correct-char");
          currentCharRef.classList.remove("correct-char-light");
          currentCharRef.classList.remove("correct-char-dark");
          currentCharRef.classList.remove("each-char-dark");
          currentCharRef.classList.remove("each-char-light");

          currentCharRef.classList.add("incorrect-char");
          incorrectForAccuracy.current += 1;
          currWordWrongLettersCount.current += 1;
        }
      }

      const currCharWidth =
        charRefs.current[currCharIndexInCharRefs.current].clientWidth;
      const t1 =
        charRefs.current[currCharIndexInCharRefs.current].getClientRects();
      const t2 = charRefs.current[currCharIndexInCharRefs.current].clientTop;
      let t3 = 0;
      if (caretRef.current) {
        t3 = caretRef.current?.offsetTop - charRefs.current[0].offsetTop;
      }
      if (caretRef.current) {
        if (currCharIndexInCharRefs.current + 1 < charRefs.current.length - 1) {
          t3 =
            charRefs.current[currCharIndexInCharRefs.current + 1].offsetTop -
            charRefs.current[0].offsetTop;
        } else {
        }
      }
      const t4 = charRefs.current[currCharIndexInCharRefs.current];
      let l1 = 0;
      if (caretRef.current) {
        if (
          currCharIndexInCharRefs.current + 1 <=
          charRefs.current.length - 1
        ) {
          l1 =
            charRefs.current[currCharIndexInCharRefs.current + 1].offsetLeft -
            charRefs.current[0].offsetLeft +
            2;
        } else if (
          currCharIndexInCharRefs.current <=
          charRefs.current.length - 1
        ) {
          l1 =
            caretRef.current.offsetLeft +
            charRefs.current[currCharIndexInCharRefs.current].clientWidth +
            2;
        } else {
        }
      }
      currCharIndexInCharRefs.current += 1;
      currCharIndexInCurrentWord.current += 1;

      prevCharIndexInCharRefs.current += 1;
      if (element) {
        element.animate(
          [
            { left: `${l1}px`, top: `${t3}px` }, // Final left position
          ],
          {
            duration: 100, // Animation duration in milliseconds
            iterations: 1, // Number of times the animation should repeat (1 means it will run once)
            fill: "forwards", // Maintain the final state of the animation after it finishes
          }
        );
      }
      caretRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

      leftPos.current += currCharWidth;

      if (
        currWordIndexInWordRefs.current + 1 == wordRefs.current.length &&
        currCharIndexInCurrentWord.current - 1 ==
          wordRefs.current[wordRefs.current.length - 1].innerText.length - 1
      ) {
        for (let i of charRefs.current) {
          if (i.classList.contains("incorrect-char")) {
            incorrectChars.current += 1;
          }
        }

        clearInterval(intervalId);

        for (let i of wordRefs.current) {
          if (!i.classList.contains("error")) {
            correctWords.current += 1;
          }
        }
        setPracticeStarted(-1);
      }
    }
  };
  // async function postUserDetails() {
  //   setCurrSentence("");
  //   const res = await axios.post("http://localhost:3000/api/user");
  //   console.log("postUserDetails called from useeffect........",res.data);
  //   setUserWpm(res.data.user.highestWpm);
  //   setUserCurrentStreak(res.data.user.currentStreak);
  //   setUserMaxStreak(res.data.user.maxStreak);
  //   setCurrSentence(res.data.sentence.sentence);

  // }

  useEffect(() => {
    setMounted(true);

    if (practiceStarted == 0) {
      console.log("practiceStarted====================0.....");

      // const res = postUserDetails();
    }

    if (practiceStarted == 1) {
      console.log("practiceStarted====================1.....");

      intervalId = setInterval(() => {
        console.log("setInterval each second  .....");

        let curr = 0;
        for (let i = 0; i <= currCharIndexInCharRefs.current; i++) {
          if (charRefs.current[i].classList.contains("incorrect-char")) {
            curr += 1;
          }
        }
        let curr2 = 0;
        for (let i = 0; i <= currWordIndexInWordRefs.current; i++) {
          if (i - 1 >= 0) {
            if (!wordRefs.current[i - 1].classList.contains("error")) {
              curr2 += 1;
            }
          }
        }

        curr -= curr2;
        listCorrectWordsEachSecond.current.push(curr2);
        listIncorrectCharsEachSecond.current.push(curr);
        listIncorrectAccuraryCharsEachSecond.current.push(
          incorrectForAccuracy.current
        );
        listTotal.current.push(currCharIndexInCharRefs.current);
      }, 1000);
    }

    document.addEventListener("keydown", handleKeyDown3);
    document.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", removeFocusOnWindowResize);
    document.addEventListener("resize", removeFocusOnWindowResize);

    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown3);
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", removeFocusOnWindowResize);
      document.removeEventListener("resize", removeFocusOnWindowResize);
    };
  }, [practiceStarted,mounted]);

  return (
    <div
      className={`outmost-padding ${
        resolvedTheme === "dark" ? "dark-theme" : "light-theme"
      }`}
      key={key}
    >
      {practiceStarted == 0 || practiceStarted == 1 ? (
        <div>
          <div
            className={`title ${
              resolvedTheme === "dark" ? "title-dark" : "title-light"
            }`}
          >
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
            </div>
          </div>

          <div className="typepractice-container" onClick={removeFocus}>
            <div className="info-panel">
              <div
                className={`info-panel-inner balasmiq-real ${
                  resolvedTheme === "dark"
                    ? "info-panel-dark"
                    : "info-panel-light"
                }`}
              >
                <ThemeSwitch resetAll={resetAll} />
                <div>
                  {resolvedTheme === "light" ? (
                    <div className="flex align-middle">
                      <div style={{ marginLeft: "40px", marginRight: "10px" }}>
                        <Image alt="" src={fire2} width={25} height={25} />
                      </div>
                      <span
                        className="balasmiq-real"
                        style={{ fontSize: "25px", lineHeight: "30px" }}
                      >
                        {userMaxStreak}
                      </span>
                      {/* <p >

                    </p> */}
                    </div>
                  ) : (
                    <div className="flex align-middle">
                      <div style={{ marginLeft: "40px", marginRight: "10px" }}>
                        <Image alt="" src={fire} width={25} height={25} />
                      </div>
                      <span
                        className="balasmiq-real"
                        style={{ fontSize: "25px", lineHeight: "30px" }}
                      >
                        {userMaxStreak}
                      </span>
                      {/* <p >

                    </p> */}
                    </div>
                  )}
                </div>
                <div>
                  {resolvedTheme === "light" ? (
                    <div className="flex align-middle">
                      <div style={{ marginLeft: "40px", marginRight: "10px" }}>
                        <Image alt="" src={wpm2} width={25} height={25} />
                      </div>
                      <span
                        className="balasmiq-real"
                        style={{ fontSize: "25px", lineHeight: "30px" }}
                      >
                        {userWpm}
                      </span>
                      {/* <p >

                  </p> */}
                    </div>
                  ) : (
                    <div className="flex align-middle">
                      <div style={{ marginLeft: "40px", marginRight: "10px" }}>
                        <Image alt="" src={wpmf} width={25} height={25} />
                      </div>
                      <span
                        className="balasmiq-real"
                        style={{ fontSize: "25px", lineHeight: "30px" }}
                      >
                        {userWpm}
                      </span>
                      {/* <p >

                </p> */}
                    </div>
                  )}
                </div>
                <div>
                  {resolvedTheme === "light" ? (
                    <div className="flex align-middle">
                      <div style={{ marginLeft: "40px", marginRight: "10px" }}>
                        <Image alt="" src={loop2} width={25} height={25} />
                      </div>
                      <span
                        className="balasmiq-real"
                        style={{ fontSize: "25px", lineHeight: "30px" }}
                      >
                        {userCurrentStreak}
                      </span>
                      {/* <p >

                  </p> */}
                    </div>
                  ) : (
                    <div className="flex align-middle">
                      <div style={{ marginLeft: "40px", marginRight: "10px" }}>
                        <Image alt="" src={loop} width={25} height={25} />
                      </div>
                      <span
                        className="balasmiq-real"
                        style={{ fontSize: "25px", lineHeight: "30px" }}
                      >
                        {userCurrentStreak}
                      </span>
                      {/* <p >

                </p> */}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* <div>{practiceStarted}</div> */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "10px",
              }}
              className="global-styling"
            >
              <Timer practiceStarted={practiceStarted} />
            </div>
            <div className="focus-lost hidden global-styling" ref={focusRef}>
              Press any key or click here to continue...
            </div>
            <div
              // style={{
              //   height: "156px",
              //   overflow: "hidden",
              //   padding: "20px 10px 20px 20px",
              //   boxShadow: "0px -5px 10px 3px rgb(187, 185, 186) inset",
              //   borderRadius:"20px",
              //   backgroundColor:"whitesmoke"
              // }}
              className={`global-styling wordsWrapper ${
                resolvedTheme === "dark"
                  ? "typing-area-dark"
                  : "typing-area-light"
              }`}
            >
              <div
                style={{
                  fontSize: "1.7rem",
                  height: "156px",
                  overflow: "hidden",
                  marginLeft: "unset",
                  transition: "all 0.25s ease 0s",
                }}
                id="words"
                onClick={addFocus}
                ref={wordsRef}
                className="type-box-sentence"
              >
                <span ref={caretRef} className="caret-pointer">
                  |
                </span>

                {currSentence.split(/(?= )/).map((word: any, wi: any) => (
                  <div
                    className="word"
                    ref={(currRef) => {
                      if (
                        !wordRefs.current.includes(currRef!) &&
                        currRef != null
                      ) {
                        wordRefs.current.push(currRef!);
                      }
                    }}
                  >
                    {word.split("").map((char: any, idx: any) => (
                      <div
                        className={`${
                          resolvedTheme === "dark"
                            ? "each-char-dark"
                            : "each-char-light"
                        }`}
                        ref={(currRef) => {
                          if (
                            !charRefs.current.includes(currRef!) &&
                            currRef != null
                          ) {
                            charRefs.current.push(currRef!);
                            if (char == " ") {
                              currRef.classList.add("incorrect-char");
                            }
                          }
                        }}
                      >
                        {char}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="restart-button-div" onClick={loadNewSentence}>
              {resolvedTheme === "light" ? (
                <Image
                  alt=""
                  src={restartL}
                  width={50}
                  height={50}
                  className="restart-button"
                />
              ) : (
                <Image
                  alt=""
                  src={restartD}
                  width={50}
                  height={50}
                  className="restart-button"
                />
              )}
            </div>
          </div>
          <div
            className={`global-styling ${
              resolvedTheme === "dark"
                ? "bottom-panel-dark"
                : "bottom-panel-light"
            }`}
            style={{
              position: "absolute",
              display: "flex",
              alignItems: "center",

              left: "0",
              bottom: "0",
              width: "100%",
              height: "10%",
            }}
          >
            <div
              className="flex justify-evenly"
              style={{
                position: "relative",
                left: "2%",
                bottom: "2%",
                width: "40%",
              }}
            >
              <div>
                {resolvedTheme === "light" ? (
                  <div
                    className="flex align-middle"
                    style={{ marginRight: "40px" }}
                  >
                    <div style={{ marginRight: "5px" }}>
                      <Image alt="" src={contact} width={20} height={20} />
                    </div>
                    <span
                      className="golden-style"
                      style={{ fontSize: "20px", lineHeight: "25px" }}
                    >
                      contact
                    </span>
                    {/* <p >

                    </p> */}
                  </div>
                ) : (
                  <div
                    className="flex align-middle"
                    style={{ marginRight: "40px" }}
                  >
                    <div style={{ marginRight: "5px" }}>
                      <Image alt="" src={contact} width={20} height={20} />
                    </div>
                    <span
                      className="golden-style"
                      style={{ fontSize: "20px", lineHeight: "25px" }}
                    >
                      contact
                    </span>
                    {/* <p >

                    </p> */}
                  </div>
                )}
              </div>
              <div>
                {resolvedTheme === "light" ? (
                  <div
                    className="flex align-middle"
                    style={{ marginRight: "40px" }}
                  >
                    <div style={{ marginRight: "5px" }}>
                      <Image alt="" src={terms} width={20} height={20} />
                    </div>
                    <span
                      className="golden-style"
                      style={{ fontSize: "20px", lineHeight: "25px" }}
                    >
                      terms
                    </span>
                    {/* <p >

                  </p> */}
                  </div>
                ) : (
                  <div
                    className="flex align-middle"
                    style={{ marginRight: "40px" }}
                  >
                    <div style={{ marginRight: "5px" }}>
                      <Image alt="" src={terms} width={20} height={20} />
                    </div>
                    <span
                      className="golden-style"
                      style={{ fontSize: "20px", lineHeight: "25px" }}
                    >
                      terms
                    </span>
                    {/* <p >

                </p> */}
                  </div>
                )}
              </div>
              <div>
                <div
                  className="flex align-middle"
                  style={{ marginRight: "40px" }}
                >
                  <div style={{ marginRight: "5px" }}>
                    <Image alt="" src={lock} width={20} height={20} />
                  </div>
                  <span
                    className="golden-style"
                    style={{ fontSize: "20px", lineHeight: "25px" }}
                  >
                    privacy
                  </span>
                  {/* <p >

                    </p> */}
                </div>
              </div>
            </div>
          </div>
          {showMotto && <Motto gotItClick={loadNewSentence}/>}
        </div>
      ) : (
        <Stats
          listIncorrectCharsEachSecond={listIncorrectCharsEachSecond.current}
          listIncorrectAccuraryCharsEachSecond={
            listIncorrectAccuraryCharsEachSecond.current
          }
          listTotal={listTotal.current}
          total={charRefs.current.length}
          incorrect={incorrectChars.current}
          incorrectAccuracy={incorrectForAccuracy.current}
          correctWords={correctWords.current}
          listCorrectWordsEachSecond={listCorrectWordsEachSecond.current}
          loadNewSentence={loadNewSentence}
        />
      )}
    </div>
  );
};

export default TypePractice;
