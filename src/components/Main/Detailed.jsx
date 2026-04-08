import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { getCountryDetails } from "../../services/api";

export const Detailed =   ({ data }) => {
  let navigate = useNavigate();
  const { id } = useParams();
  const [countryDetails, setCountryDetails] = useState(data.find((element) => element.ccn3 === id));
  const handleBackButon = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (id) {
      document.title = `Where in the world? - ${
        data.find((element) => element.ccn3 === id).name.common
      } `;
    } else {
      document.title = `Where in the world? - not found`;
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      let temp = await getCountryDetails(id);
      // console.log(data.find((element) => element.ccn3 === id));
      
      setCountryDetails({ ...temp, ...data.find((element) => element.ccn3 === id) });
    }
    fetchData();
  },[])
  return (
    <>
    <div className="flex flex-col w-11/12 mx-auto dark:text-white transition-colors items-center justify-center h-full max-h-full">
       <div className="dark:bg-white/10 backdrop-blur-sm p-5 rounded">
  <div className="py-5">
  <button
                onClick={handleBackButon}
                className="border rounded px-4 flex flex-row-reverse items-center hover:bg-dark-mode-ligth/10 transition-colors"
              >
                Back
                <ArrowLeftIcon className="w-4 h-4 stroke-2" />
              </button>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-x-4">
              <div className="md:w-1/2">
                <img src={countryDetails.flags.svg} alt={countryDetails.name.common} />
              </div>
              <div className="w-full md:w-1/2 flex flex-col self-stretch">
                <p className="flex flex-col">
                  <span className="font-bold text-xl md:text-4xl">
                    {countryDetails.name.common}{" "}
                  </span>
                  <small className="md:text-lg">{countryDetails.name.official}</small>
                </p>
                <div className="flex flex-col md:grid md:grid-cols-2 md:gap-2 gap-4 h-full">
                  <p className="flex gap-x-1">
                    <span className="font-semibold">Population:</span>
                    <span>{countryDetails.population.toLocaleString()}</span>
                  </p>
                  <p className="flex gap-x-1">
                    <span className="font-semibold">Region:</span>
                    <span>{countryDetails.region}</span>
                  </p>
                  <p className="flex gap-x-1">
                    <span className="font-semibold">Subregion:</span>
                    <span>{countryDetails.subregion}</span>
                  </p>
                  <p className="flex gap-x-1">
                    <span className="font-semibold">Capital:</span>
                    <span>{countryDetails.capital}</span>
                  </p>
                  <p className="flex gap-x-1">
                    <span className="font-semibold">Top level domain:</span>
                    <span>{countryDetails.tld}</span>
                  </p>
                  <div className="flex flex-wrap gap-x-1">
                    <p className="font-semibold">Currencies:</p>
                    <p className="flex flex-wrap">
                      {countryDetails.currencies && Object.entries(countryDetails.currencies).map((el, index) => (
                        <span key={index}>{`${el[1].name} ${index !== Object.entries(countryDetails.currencies).length - 1 ? "," : ""}`}</span>
                      ))}
                    </p>
                  </div>
                  <div className="flex flex-wrap">
                    <p className="font-semibold">Languages:</p>
                    <p className="flex flex-row w-fit flex-wrap gap-x-1">
                      {
                        countryDetails.languages && Object.entries(countryDetails.languages).map((el, index) => (
                          <span key={index} className="whitespace-nowrap">{`${el[1]}${index !== Object.entries(countryDetails.languages).length - 1 ? "," : ""}`}</span>
                        ))
                      }
                    </p>
                  </div>
                  <div className="col-span-3 md:col-span-2 md:flex md:flex-col md:gap-2">
                    <p className="font-semibold">Border countries:</p>
                    <p className="flex flex-row flex-wrap gap-x-2 gap-1">
                      {
                        countryDetails.borders && countryDetails.borders.map((border, index) => {
                          const borderCountry = data.find((el) => el.cca3 === border);
                          return (
                            <Link
                              key={index}
                              to={`/country/${borderCountry.ccn3}`}
                              className="py-1 px-2 rounded text-sm text-center dark:bg-dark-mode-ligth shadow hover:bg-dark-mode-ligth/10 transition-colors"
                            >{`${borderCountry.name.common}`}</Link>
                          );
                        })
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  )
};
