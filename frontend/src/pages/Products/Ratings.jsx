import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value, text, color = "yellow-400" }) => {
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars > 0.5 ? 1 : 0;
  const emptyStar = 5 - fullStars - halfStars;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar
          key={index}
          className={`text-${color} ml-1 text-xs transition-transform transform hover:scale-125 duration-200 text-yellow-300`}
        />
      ))}

      <div>
        {halfStars === 1 && (
          <FaStarHalfAlt
            className={`text-${color} ml-1 text-xs transition-transform transform hover:scale-125 duration-200`}
          />
        )}
      </div>

      {[...Array(emptyStar)].map((_, index) => (
        <FaRegStar
          key={index}
          className="text-[#FFAB31] ml-1 text-xs transition-transform transform hover:scale-105 duration-200"
        />
      ))}

      <span className="text-yellow-300 font-medium hover:text-yellow-400 transition-colors duration-300">
        {text && text}
      </span>
    </div>
  );
};

export default Ratings;
