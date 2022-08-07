import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Flag } from "./Flag";
import { Search } from "./Search";

export const Home = ({ data }) => {
  // console.log(data);
  const [show, setShow] = useState();
  const [newData, setNewData] = useState();
  const [search, setSearch] = useState();

  const handleChange = (event) => {
    let value;
    // let tempData;
    switch (event.target.value) {
      case "1":
        value = "Africa";
        break;
      case "2":
        value = "Americas";
        break;
      case "3":
        value = "Asia";
        break;
      case "4":
        value = "Europe";
        break;
      case "5":
        value = "Oceania";
        break;
      default:
        break;
    }
    if (value) {
      let filterRegion = data.filter((data) => {
        return data.region.toLowerCase() === value.toLowerCase();
      });
      let tempShow = [...filterRegion];
      tempShow.length = 8;
      setNewData([...filterRegion]);
      setShow(tempShow);
    } else {
      let tempShow = [...data];
      tempShow.length = 8;
      setNewData([...data]);
      setShow(tempShow);
    }
  };
  useEffect(() => {
    if (data) {
      let temp = [...data];
      setShow(temp);
    }
  }, [data]);

  if (show) {
    return (
      <>
        <div className="flex flex-col lg:flex-row lg:h-12 px-10 gap-7 my-8">
          <div className="w-full h-12">
            <Search
              data={newData ? newData : data}
              setData={setShow}
              search={search}
              setSearch={setSearch}
            />
          </div>
          <select
            className="h-12 w-1/2 lg:h-full bg-white dark:bg-dark-mode-ligth dark:text-white rounded shadow px-3"
            defaultValue={"0"}
            name=""
            id=""
            onChange={handleChange}
          >
            <option value="0" disabled>
              Filter by region
            </option>
            <option value="1">Africa</option>
            <option value="2">America</option>
            <option value="3">Asia</option>
            <option value="4">Europe</option>
            <option value="5">Oceania</option>
            <option value="6">All</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 w-full justify-items-center gap-16 px-10">
          {show.map((element) => (
            <Link
              to={`/country/${element.ccn3}`}
              id={element.ccn3}
              className="w-full"
            >
              <Flag data={element} />
            </Link>
          ))}
        </div>
      </>
    );
  }
};
