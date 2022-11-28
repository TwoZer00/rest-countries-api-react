import React, { useContext, useEffect } from "react";
import {
  FlagIcon,
  ListBulletIcon as ViewListIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  GlobeAmericasIcon as GlobeIcon,
} from "@heroicons/react/24/outline";
import {
  FlagIcon as FlagIconSolid,
  ListBulletIcon as ViewListIconSolid,
  ArrowTrendingUpIcon as TrendingUpIconSolid,
  GlobeAmericasIcon as GlobeIconSolid,
  MapPinIcon as MapPinIconSolid,
  ClockIcon as ClockIconSolid
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { useState } from "react";
import { DataContext } from "./App";
import { getRandomInt, unMemberFilter } from "./utils";
import { useRef } from "react";

export default function GameDashboard({ dark, data, setData, gamep, gamepf }) {
  let datause = useContext(DataContext);
  const [enableD, setEnableD] = useState(true);
  const [region, setRegion] = useState("world");
  const [duration, setDuration] = useState("complete");
  const regionRef = useRef()
  const durationRef = useRef()
  useEffect(() => {
    document.title = `Where in the world? - Games`;
    regionRef.current.value && setData(unMemberFilter(datause))
  }, []);
  const handleChange = (e) => {
    let value = e.target.value;
    if (value) {
      setRegion(numberToRegion(value));
      setData(regionFiltered(numberToRegion(value)));
      gamepf({ region: numberToRegion(regionRef.current.value), duration: numberToDuration(durationRef.current.value) })
    }
  }
  const regionFiltered = (region) => {
    // console.log(datause)
    let temp = datause.filter(value => { return value.unMember || value.ccn3 === "275" || value.ccn3 === '336' });
    if (region === 'asiania') {
      return temp.filter(value => { return (value.region).toLowerCase() === 'asia' || (value.region).toLowerCase() === 'oceania' });
    }
    else if (region != 'world') {
      return temp.filter(value => { return (value.region).toLowerCase() === region });
    }
    else {
      return temp
    }
  }

  const numberToRegion = (value) => {
    switch (parseInt(value)) {
      case 1:
        return 'americas';
      case 2:
        return 'europe';
      case 3:
        return 'africa';
      case 4:
        return 'asiania';
      default:
        return 'world';
    }
  }

  const regionToNumber = (value) => {
    switch (value) {
      case 'americas':
        return 1;
      case 'europe':
        return 2;
      case 'africa':
        return 3;
      case 'asiania':
        return 4;
      default:
        return 0;
    }
  }
  const numberToDuration = (value) => {
    switch (parseInt(value)) {
      case 1:
        return 'small';
      case 2:
        return 'medium';
      default:
        return 'complete';
    }
  }
  const handleChangeDuration = (e) => {
    let value = e.target.value;
    gamepf({ region: numberToRegion(regionRef.current.value), duration: numberToDuration(durationRef.current.value) })
    let divider = 0;
    switch (numberToDuration(value)) {
      case 'small':
        divider = 3
        break;
      case 'medium':
        divider = 2
        break;
      default:
        divider = 1;
        break;
    }
    let tempdata = datause.filter(value => { return value.unMember || value.ccn3 === "275" || value.ccn3 === '336' });
    let size = Math.round(tempdata.length / divider);
    let temp = [];
    for (let i = 0; i <= size; i++) {
      let tempValue = tempdata[getRandomInt(tempdata.length)];
      if (temp.indexOf(tempValue) === -1) {
        temp.push(tempValue);
      }
    }
    setData(temp);
  }
  return (
    <div className="flex flex-col dark:text-white items-center justify-center gap-2 pt-2 h-full">
      <div className="p-5 rounded bg-white/10 backdrop-blur border-dark-mode-ligth shadow-lg flex flex-col gap-5">
        <div className="flex flex-row items-center gap-x-2 transition-colors">
          <h1 className="text-6xl font-bold">Let's play</h1>
          {dark ? (
            <GlobeIconSolid className="w-12 h-12" />
          ) : (
            <GlobeIcon className="w-12 h-12" />
          )}
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <MapPinIconSolid className="h-5 w-5" />
              <select name="region" onChange={handleChange} ref={regionRef} defaultValue={regionToNumber(gamep.region)} className="px-2 py-1 rounded dark:bg-dark-mode-ligth dark:border">
                <option disabled>Choose region</option>
                <option value="0">World</option>
                <option value="1">Americas</option>
                <option value="2">Europe</option>
                <option value="3">Africa</option>
                <option value="4">Asia - Oceania</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <ClockIconSolid className={`h-5 w-5 ${!enableD ? "opacity-20" : ""}`} />
              <select name="duration" onChange={handleChangeDuration} ref={durationRef} disabled={gamep.region != "world"} defaultValue={gamep.region != "world" ? "4" : "0"} className="rounded px-2 py-1 capitalize dark:bg-dark-mode-ligth disabled:opacity-20 dark:border">
                <option disabled value="4">Duration</option>
                <option value="1">Small</option>
                <option value="2">Medium</option>
                <option value="0">Complete</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col">
            <Link
              to={`/guesstheflag`}
              className="border p-2 rounded shadow hover:bg-black/20 transition-all flex flex-row items-center justify-center gap-x-2"
            >
              Guess the Flag
              {dark ? (
                <FlagIconSolid className="w-5 h-5" />
              ) : (
                <FlagIcon className="w-5 h-5" />
              )}
            </Link>
            <small className="text-center">
              Based on the country flag choose the correct option
            </small>
          </div>
          <div className="flex flex-col">
            <Link
              to={"/guessthecountry"}
              className="border p-2 rounded shadow hover:bg-black/20 transition-all flex flex-row items-center justify-center gap-x-2"
            >
              Guess the country
              {dark ? (
                <ViewListIconSolid className="w-5 h-5" />
              ) : (
                <ViewListIcon className="w-5 h-5" />
              )}
            </Link>
            <small className="text-center">
              Based on the description name the correct country
            </small>
          </div>
        </div>
        <div className="flex flex-col pt-5 border-t">
          <Link
            to={"/higherlower"}
            className="border p-2 rounded shadow hover:bg-black/20 transition-all flex flex-row items-center justify-center gap-x-2"
          >
            Higher or lower
            {dark ? (
              <TrendingUpIconSolid className="w-5 h-5" />
            ) : (
              <TrendingUpIcon className="w-5 h-5" />
            )}
          </Link>
          <small className="text-center">
            Based on the population choose the correct option
          </small>
        </div>
      </div>
    </div>
  );
}
