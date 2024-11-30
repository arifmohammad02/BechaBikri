

// eslint-disable-next-line react/prop-types
const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-6 p-6">
      {/* Step 1 */}
      <div className="flex flex-col items-center">
        <div
          className={`w-12 h-12 rounded-full flex justify-center items-center text-white ${
            step1 ? "bg-green-500" : "bg-gray-300"
          } shadow-md transform transition-transform duration-300 ${
            step1 && "scale-110 hover:scale-125"
          }`}
        >
          1
        </div>
        <span
          className={`mt-2 text-sm ${
            step1 ? "text-green-600 font-semibold" : "text-gray-500"
          }`}
        >
          Login
        </span>
      </div>

      {/* Connector for Step 2 */}
      {step2 && (
        <div
          className={`h-1 w-16 md:w-20 lg:w-24 bg-gradient-to-r md:mb-5 ${
            step1
              ? "from-green-500 via-blue-400 to-blue-500"
              : "from-gray-300 to-gray-400"
          }`}
        ></div>
      )}

      {/* Step 2 */}
      {step2 && (
        <div className="flex flex-col items-center">
          <div
            className={`w-12 h-12 rounded-full flex justify-center items-center text-white ${
              step2 ? "bg-blue-500" : "bg-gray-300"
            } shadow-md transform transition-transform duration-300 ${
              step2 && "scale-110 hover:scale-125"
            }`}
          >
            2
          </div>
          <span
            className={`mt-2 text-sm ${
              step2 ? "text-blue-600 font-semibold" : "text-gray-500"
            }`}
          >
            Shipping
          </span>
        </div>
      )}

      {/* Connector for Step 3 */}
      {step3 && (
        <div
          className={`h-1 w-16 md:w-20 lg:w-24 bg-gradient-to-r md:mb-5 ${
            step2 && step3
              ? "from-blue-500 via-purple-400 to-purple-500"
              : "from-gray-300 to-gray-400"
          }`}
        ></div>
      )}

      {/* Step 3 */}
      <div className="flex flex-col items-center">
        <div
          className={`w-12 h-12 rounded-full flex justify-center items-center text-white ${
            step3 ? "bg-purple-500" : "bg-gray-300"
          } shadow-md transform transition-transform duration-300 ${
            step3 && "scale-110 hover:scale-125"
          }`}
        >
          3
        </div>
        <span
          className={`mt-2 text-sm ${
            step3 ? "text-purple-600 font-semibold" : "text-gray-500"
          }`}
        >
          Summary
        </span>
      </div>
    </div>
  );
};

export default ProgressSteps;
