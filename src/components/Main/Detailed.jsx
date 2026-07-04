import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import usePageMeta from "../../hooks/usePageMeta";

export default function Detailed({ data }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const countryDetails = data.find((element) => element.ccn3 === id);

  usePageMeta(
    countryDetails
      ? `Where in the world? - ${countryDetails.name.common}`
      : "Where in the world? - Not found",
    countryDetails
      ? `Learn about ${countryDetails.name.common}: population, region, capital, languages, and bordering countries.`
      : "Country not found."
  );

  if (!countryDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-full dark:text-white">
        <p className="text-2xl font-bold">Country not found</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 border rounded py-2 px-4 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          Go home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-11/12 mx-auto dark:text-white transition-colors items-center justify-center h-full max-h-full overflow-auto py-4">
      <div className="dark:bg-white/10 backdrop-blur-sm p-4 sm:p-5 rounded">
        <div className="py-3 sm:py-5">
          <button
            onClick={() => navigate(-1)}
            className="border rounded py-2 px-4 flex flex-row-reverse items-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            Back
            <ArrowLeftIcon className="w-4 h-4 stroke-2" />
          </button>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
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
                        className="py-1 px-2 rounded text-sm text-center dark:bg-dark-mode-light shadow hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
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
