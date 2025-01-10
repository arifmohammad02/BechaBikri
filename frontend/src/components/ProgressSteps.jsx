// eslint-disable-next-line react/prop-types
const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-6 p-6">
      {/* Step 1 */}
      <div className="flex flex-col items-center">
        <div
          className={`w-12 h-12 rounded-full flex justify-center font-poppins font-normal items-center text-[#242424] ${
            step1 ? "bg-[#F9F1E7]" : "bg-gray-300"
          }   ${step1 && "scale-110 hover:scale-125"}`}
        >
          1
        </div>
        <span
          className={`mt-2 text-sm ${
            step1 ? "text-[#242424] font-poppins font-normal" : "text-[#F9F1E7]"
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
              ? "from-[#F9F1E7] via-[#F9F1E7] to-[#F9F1E7]"
              : "from-[#F9F1E7] to-[#F9F1E7]"
          }`}
        ></div>
      )}

      {/* Step 2 */}
      {step2 && (
        <div className="flex flex-col items-center">
          <div
            className={`w-12 h-12 rounded-full flex justify-center font-poppins font-normal items-center text-[#242424] ${
              step2 ? "bg-[#F9F1E7]" : "bg-[#F9F1E7]"
            }  ${step2 && "scale-110 hover:scale-125"}`}
          >
            2
          </div>
          <span
            className={`mt-2 text-sm ${
              step2
                ? "text-[#242424] font-poppins font-normal"
                : "text-[#242424]"
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
              ? "from-[#F9F1E7] via-[#F9F1E7] to-[#F9F1E7]"
              : "from-[#F9F1E7] to-[#F9F1E7]"
          }`}
        ></div>
      )}

      {/* Step 3 */}
      <div className="flex flex-col items-center">
        <div
          className={`w-12 h-12 rounded-full flex justify-center font-poppins font-normal  items-center text-[#242424] ${
            step3 ? "bg-[#F9F1E7]" : "bg-[#F9F1E7]"
          }  ${step3 && ""}`}
        >
          3
        </div>
        <span
          className={`mt-2 text-sm ${
            step3 ? "text-[#242424] font-poppins font-normal" : "text-[#242424]"
          }`}
        >
          Summary
        </span>
      </div>
    </div>
  );
};

export default ProgressSteps;
