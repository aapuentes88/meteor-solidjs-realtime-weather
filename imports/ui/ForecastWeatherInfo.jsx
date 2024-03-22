import { createEffect } from "solid-js";
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/solid';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const ForecastWeatherInfo = (props) => {
  const forecastItem = ({date, main, description, temp}) => {
    return (
      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* Fecha */}
  <div className="sm:col-span-2 flex flex-col sm:flex-row justify-between">
    <div className="text-xs sm:text-sm text-gray-600">{date}</div>
  </div>
  
  {/* Descripción */}
  <div className="flex justify-center items-center"> {/* Centra horizontal y verticalmente */}
    <p className="text-center text-gray-800 font-semibold text-lg sm:text-md">{description}</p>
  </div>
  
  {/* Temperatura */}
  <div className="flex flex-col items-center justify-center"> {/* Centra horizontal y verticalmente */}
    <span className="text-2xl font-semibold text-gray-800">{temp}</span>
    <span className="text-sm text-gray-600">Celsius</span>
  </div>
</div>
    );
  }

  return (

    <div className="mx-auto max-w-screen-lg px-4 sm:px-6 scroll-container">
      {/* Espacio entre el componente y otros elementos */}
      <div className="mb-8"></div>
      <span className="text-xl font-semibold text-gray-800">24 Hours Forecast</span>

      <div className="flex justify-center scroll-content  ">
       <Swiper
                 modules={[Navigation, Pagination, Scrollbar, A11y]}
                 spaceBetween={0}
                 slidesPerView={1}
                 navigation
                 pagination={{ clickable: true }}
                 scrollbar={{ draggable: true }}
                 onSwiper={(swiper) => console.log(swiper)}
                 onSlideChange={() => console.log('slide change')}
          >
        {props.forecastWeatherData[0]?.list.map(item => {
          const itemDataToRender = { date: item.dt_txt, main: item.weather.main, description: item.weather.description,
                                     temp: (item.main.temp - 273.15).toFixed(2)   }
          return (
            <SwiperSlide>              
              {forecastItem(itemDataToRender)}
            </SwiperSlide>
          );
         })}
       </Swiper>
      </div>
        {/* Espacio entre el componente y otros elementos */}
      <div className="mt-8"></div>
    
      </div>
  
  )
};

export default ForecastWeatherInfo;