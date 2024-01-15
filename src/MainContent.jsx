import React, { Suspense, useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import PrayerCard from "./Components/PrayerCard";
import fajr from "./assets/fajr.png";
import dhr from "./assets/dhr.png";
import sunrise from "./assets/runrise.jpg";
import asr from "./assets/asr.png";
import sunset from "./assets//sunset.jpg";
import night from "./assets/isha.jpg";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Stack } from "@mui/material";
import moment from "moment";
import axios from "axios";
import "moment/dist/locale/ar-sa";
moment.locale("ar");
export default function MainContent() {
  // Use State
  const [day, setDay] = useState("");
  //================================================================

  const [location, setLocation] = useState({
    DISPLAY: "مكة المكرمة",
    COUNTRY: "SA",
    CITY: "Jeddah",
  });
  //================================================================

  const [time, setTime] = useState({
    Fajr: "05:43",
    Sunrise: "07:03",
    Dhuhr: "12:32",
    Asr: "15:39",
    Sunset: "18:01",
    Isha: "19:31",
  });
  //================================================================
  const [prayerIndex, setPrayerIndex] = useState(1);

  //================================================================
  const [nextPrayer, setNextPrayer] = useState({
    key: "",
    displayName: "",
  });
  //================================================================
  const [remainingTime, setRemainingTime] = useState("");
  // Use State
  //================================================================

  // Use Effect
  useEffect(() => {
    getData();
  }, [location]);
  //================================================================
  useEffect(() => {
    let interval = setInterval(() => {
      SetCountDownTimer();
    }, 1000);

    const t = moment();
    setDay(t.format("Do MMM YYYY | h:mm"));
    return () => {
      clearInterval(interval);
    };
  }, [time]);
  // Use Effect
  //================================================================
  // Define Variables & Functions
  const cities = [
    { DISPLAY: "مكة المكرمة", COUNTRY: "SA", CITY: "Jeddah" },
    { DISPLAY: "الدوحة", COUNTRY: "QA", CITY: "Doha" },
    { DISPLAY: "القاهرة", COUNTRY: "EG", CITY: "Cairo" },
    { DISPLAY: "أبوظبي", COUNTRY: "AE", CITY: "Abu Dhabi" },
  ];
  const prayersArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Sunrise", displayName: "الضحى" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Sunset", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ];
  //================================================================

  const prayers = [
    {
      key: "Fajr",
      displayName: "الفجر",
    },
    {
      key: "Sunrise",
      displayName: "الشروق",
    },
    {
      key: "Dhuhr",
      displayName: "الظهر",
    },
    {
      key: "Asr",
      displayName: "العصر",
    },
    {
      key: "Sunset",
      displayName: "المغرب",
    },
    {
      key: "Isha",
      displayName: "العشاء",
    },
  ];
  //================================================================
  const handleChange = (event) => {
    const cityObject = cities.find((city) => {
      return city.CITY == event.target.value.CITY;
    });
    setLocation(cityObject);
  };

  const SetCountDownTimer = () => {
    const timeNow = moment();
    let NextPrayerIndex = 1;

    if (
      timeNow.isAfter(moment(time["Sunrise"], "hh:mm")) &&
      timeNow.isBefore(moment(time["Dhuhr"], "hh:mm"))
    ) {
      NextPrayerIndex = 2;
    } else if (
      timeNow.isAfter(moment(time["Dhuhr"], "hh:mm")) &&
      timeNow.isBefore(moment(time["Asr"], "hh:mm"))
    ) {
      NextPrayerIndex = 3;
    } else if (
      timeNow.isAfter(moment(time["Asr"], "hh:mm")) &&
      timeNow.isBefore(moment(time["Sunset"], "hh:mm"))
    ) {
      NextPrayerIndex = 4;
    } else if (
      timeNow.isAfter(moment(time["Sunset"], "hh:mm")) &&
      timeNow.isBefore(moment(time["Isha"], "hh:mm"))
    ) {
      NextPrayerIndex = 5;
    } else if (
      timeNow.isAfter(moment(time["Fajr"], "hh:mm")) &&
      timeNow.isBefore(moment(time["Sunrise"], "hh:mm"))
    ) {
      NextPrayerIndex = 1;
    } else {
      NextPrayerIndex = 0;
    }
    setPrayerIndex(NextPrayerIndex);

    const nextPrayerObject = prayersArray[NextPrayerIndex];
    const nextPrayerTime = time[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");
    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(timeNow);

    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(timeNow);
      const fajrtomidnight = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );

      const total = midnightDiff + fajrtomidnight;
      remainingTime = total;
    }

    const durationRemainingTime = moment.duration(remainingTime);
    setRemainingTime(
      `${durationRemainingTime.hours()}:${durationRemainingTime.minutes()}:${durationRemainingTime.seconds()}`
    );
  };
  // Define Variables
  //================================================================
  //Fetching Data
  const getData = async () => {
    const res = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=${location.COUNTRY}&city=${location.CITY}`
    );
    setTime(res.data.data.timings);
  };
  //Fetching Data
  //================================================================

  return (
    <div>
      {/* Header  */}

      <Grid container>
        <Grid item sm={6}>
          <div>
            <h2>{day}</h2>
            <h1>{location.DISPLAY}</h1>
          </div>
        </Grid>
        <Grid item sm={6}>
          <div>
            <Suspense>
              <h2>يتبقى على {prayersArray[prayerIndex].displayName}</h2>
              <h1>{remainingTime}</h1>
            </Suspense>
          </div>
        </Grid>
      </Grid>
      {/* Header */}

      {/* Divider */}

      <Divider style={{ borderColor: "white", opacity: 0.1 }} />
      {/* Divider */}
      {/* Select */}
      <Stack
        direction="row"
        justifyContent="center"
        style={{ marginTop: "30px" }}
      >
        <FormControl style={{ width: "300px" }}>
          <InputLabel id="demo-simple-select-label" style={{ color: "white" }}>
            المدينة
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={location.DISPLAY}
            label="Age"
            onChange={handleChange}
            style={{
              border: "1px solid white",
            }}
          >
            {cities.map((city) => {
              return (
                <MenuItem
                  key={city.CITY}
                  value={{
                    DISPLAY: city.DISPLAY,
                    COUNTRY: city.COUNTRY,
                    CITY: city.CITY,
                  }}
                >
                  {city.DISPLAY}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
      {/* Select */}
      {/* Cards */}

      <Grid container spacing={2} style={{ marginTop: "10px" }}>
        <Grid item xs={12} md={6} lg={4}>
          <PrayerCard img={fajr} name={"الفجر"} time={time.Fajr} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <PrayerCard img={sunrise} name={"الشروق"} time={time.Sunrise} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <PrayerCard img={dhr} name={"الظهر"} time={time.Dhuhr} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <PrayerCard img={asr} name={"العصر"} time={time.Asr} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <PrayerCard img={sunset} name={"المغرب"} time={time.Sunset} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <PrayerCard img={night} name={"العشاء"} time={time.Isha} />
        </Grid>
      </Grid>
      {/* Cards */}
    </div>
  );
}
