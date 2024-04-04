import { createEffect } from "solid-js";

const MainInfo = (props) => {

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
    {/* Info */}
    <div className="flex flex-col items-center justify-center">
    <p className="text-center text-gray-700 font-semibold md:text-lg sm:text-sm">{props.name}</p>
    <span className="text-center font-semibold text-gray-800 md:text-xl sm:text-lg">{props.value}</span>
    </div>
  </div>
  );
};

export default MainInfo;