export default function Flag({ data }) {
  return (
    <div className="flex flex-col shadow-lg rounded-lg overflow-hidden bg-white dark:bg-dark-mode-light min-h-[300px] sm:min-h-[350px]">
      <div className="flex-none aspect-[3/2] overflow-hidden">
        <img
          src={data.flags.svg}
          alt={data.name.common}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col p-4 sm:p-5 w-full h-full justify-center">
        <h1 className="font-bold mb-2">{data.name.common}</h1>
        <div className="text-sm">
          <p>
            <span className="font-bold">Population: </span>
            <span>{data.population.toLocaleString("en-US")}</span>
          </p>
          <p>
            <span className="font-bold">Region: </span>
            <span>{data.region}</span>
          </p>
          <p>
            <span className="font-bold">Capital: </span>
            <span>{data.capital ? data.capital[0] : ""}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
