import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { getCountryDetails } from "../../services/api";

export const Detailed = ({ data }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const overview = data.find((element) => element.ccn3 === id);
  const [countryDetails, setCountryDetails] = useState(overview);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = overview
      ? `Where in the world? - ${overview.name.common}`
      : "Where in the world? - Not found";
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const details = await getCountryDetails(id);
      setCountryDetails({ ...details, ...data.find((el) => el.ccn3 === id) });
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (!overview) {
    return (
      <div className="flex flex-col items-center justify-center h-full dark:text-white">
        <p className="text-2xl font-bold">Country not found</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 border rounded px-4 py-1 hover:bg-dark-mode-ligth/10 transition-colors"
        >
          Go home
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl font-semibold dark:text-white animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-11/12 mx-auto dark:text-white transition-colors items-center justify-center h-full max-h-full">
      <div className="dark:bg-white/10 backdrop-blur-sm p-5 rounded">
        <div className="py-5">
          <button
            onClick={() => navigate(-1)}
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
                {countryDetails.name.common}
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
                  {countryDetails.currencies && Object.values(countryDetails.currencies).map((c, i, arr) => (
                    <span key={i}>{c.name}{i < arr.length - 1 ? ", " : ""}</span>
                  ))}
                </p>
              </div>
              <div className="flex flex-wrap">
                <p className="font-semibold">Languages:</p>
                <p className="flex flex-row w-fit flex-wrap gap-x-1">
                  {countryDetails.languages && Object.values(countryDetails.languages).map((lang, i, arr) => (
                    <span key={i} className="whitespace-nowrap">{lang}{i < arr.length - 1 ? "," : ""}</span>
                  ))}
                </p>
              </div>
              <div className="col-span-3 md:col-span-2 md:flex md:flex-col md:gap-2">
                <p className="font-semibold">Border countries:</p>
                <p className="flex flex-row flex-wrap gap-x-2 gap-1">
                  {countryDetails.borders?.map((border, index) => {
                    const borderCountry = data.find((el) => el.cca3 === border);
                    if (!borderCountry) return null;
                    return (
                      <Link
                        key={index}
                        to={`/country/${borderCountry.ccn3}`}
                        className="py-1 px-2 rounded text-sm text-center dark:bg-dark-mode-ligth shadow hover:bg-dark-mode-ligth/10 transition-colors"
                      >
                        {borderCountry.name.common}
                      </Link>
                    );
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
