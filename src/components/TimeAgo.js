import React, { useState, useEffect } from "react";
import {
  MILLISECOND_MINUTE,
  MILLISECOND_HOUR,
  MILLISECOND_DAY,
  MILLISECOND_WEEK,
  monthFullName,
  monthShortName,
  daysOfWeek,
  MESSAGE,
  DATE_TYPES,
} from "../constants";
import useInterval from "../hooks/useInterval";

const TimeAgo = ({
  date,
  label = "Created:",
  dateFormat = "",
  separator = "/",
  dateWithTime = false,
  className,
}) => {
  const [timeSinceCreation, setTimeSinceCreation] = useState("");

  // setInterval custom hook
  useInterval(() => {
    calculateTime();
  }, 60000);

  useEffect(() => {
    calculateTime();
  }, [dateFormat, dateWithTime, separator, date]);

  // Find if hours is one or more than one
  const isSingleHour = (hours) =>
    hours === 1 ? MESSAGE.ONE_HOUR : MESSAGE.UNDER_A_DAY;

  // Find if minutes are one or more than one
  const isSingleMinute = (minutes) =>
    minutes === 1 ? MESSAGE.ONE_MINUTE : MESSAGE.UNDER_AN_HOUR;

  // Get the difference in current time and time of creation
  const getDifferenceInTime = () =>
    new Date().getTime() - new Date(date).getTime();

  // Calculate the time of creation
  const calculateTime = () => {
    const differenceInTime = getDifferenceInTime();

    const minAgo = Math.round(differenceInTime / 1000 / 60);
    const hoursAgo = Math.round(differenceInTime / 1000 / 60 / 60);
    const daysAgo = Math.round(differenceInTime / 1000 / 60 / 60 / 24);

    if (differenceInTime < MILLISECOND_MINUTE) {
      setTimeSinceCreation(MESSAGE.UNDER_A_MINUTE);
    } else if (differenceInTime < MILLISECOND_HOUR) {
      setTimeSinceCreation(minAgo + isSingleMinute(minAgo));
    } else if (differenceInTime < MILLISECOND_DAY) {
      setTimeSinceCreation(hoursAgo + isSingleHour(hoursAgo));
    } else if (
      differenceInTime < MILLISECOND_DAY * 2 &&
      differenceInTime > MILLISECOND_DAY
    ) {
      setTimeSinceCreation((timeSinceCreation) => MESSAGE.UNDER_TODAY);
    } else if (
      differenceInTime < MILLISECOND_WEEK &&
      differenceInTime < MILLISECOND_DAY * 3
    ) {
      setTimeSinceCreation(daysAgo + MESSAGE.DAYS_AGO);
    } else {
      setTimeSinceCreation(getDateFormat(dateFormat, separator, dateWithTime));
    }
  };

  const getDateFormat = (format, separatorSymbol, hasTime) => {
    const separatorsGroup = /[-/ ]/;

    const daysSlot = format.split(separatorsGroup)[0] || "dd";
    const monthsSlot = format.split(separatorsGroup)[1] || "mm";
    const yearsSlot = format.split(separatorsGroup)[2] || "yy";

    return `${position(date, daysSlot)}
     ${separatorSymbol} 
     ${position(date, monthsSlot)} 
     ${separatorSymbol} 
     ${position(date, yearsSlot)}
     ${hasTime ? `at ${position(date, "tt")}` : ""}`;
  };

  const { dd, DD, mm, M, MM, yy, YY, tt } = DATE_TYPES;
  function position(date, d) {
    switch (d) {
      case dd:
        return (
          daysOfWeek[new Date(date).getDay()] + ", " + new Date(date).getDate()
        );

      case DD:
        return new Date(date).getDate();

      case mm:
        return new Date(date).getMonth() + 1;

      case M:
        return getMonthWord(new Date(date).getMonth(), M);

      case MM:
        return getMonthWord(new Date(date).getMonth(), MM);

      case yy:
        return String(new Date(date).getFullYear()).match(/^\d{2}(\d{2})$/)[1];

      case YY:
        return new Date(date).getFullYear();

      case tt:
        return new Date(date).getHours() + ":" + new Date(date).getMinutes();

      default:
        throw new Error(`Whoops! ${d} is not valid time symbol.`);
    }
  }

  const getMonthWord = (month, shortLongWord) => {
    const monthWord = shortLongWord === MM ? monthFullName : monthShortName;
    return monthWord[month];
  };

  return (
    <span className={className}>
      {label} {timeSinceCreation}
    </span>
  );
};

export default TimeAgo;
