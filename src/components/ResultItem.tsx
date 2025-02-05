import { ResultItemProps } from "../types";

function ResultItem({ city, addCity }: ResultItemProps) {
  return (
    <div className="d-flex align-items-center result-item">
      <span>
        {city.name}, {city.state ? `${city.state}, ` : ""} {city.country}
      </span>
      <button
        className="btn btn-s"
        onClick={() => {
          addCity(city);
        }}
      >
        +
      </button>
    </div>
  );
}

export default ResultItem;
