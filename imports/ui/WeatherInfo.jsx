import { createEffect } from "solid-js";

const WeatherInfo = (props) => {
  // const  {weatherData}  = props; //No se debedesestructurar props en solid  

  // Función para formatear la fecha
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', { month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit', second: '2-digit' }).format(new Date(date));
  };

  // Efecto para actualizar el título de la página cuando cambia el tiempo
  createEffect(() => {
    if (props.weatherData) {
      document.title = `Weather in ${props.weatherData.city}`;
    }
  });

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* Descripción */}
  <p className="text-center text-gray-800 font-semibold text-lg sm:text-xl">{props.weatherData.description}</p>

  {/* Temperatura */}
  <div className="flex flex-col items-center">
    <span className="text-3xl font-semibold text-gray-800">{props.weatherData.main.temp}</span>
    <span className="text-sm text-gray-600">Celsius</span>
  </div>

  {/* Ciudad y Fecha */}
  <div className="sm:col-span-2 flex flex-col sm:flex-row justify-between">
    <div className="text-xs sm:text-sm text-gray-600">{props.weatherData.city}</div>
    <div className="text-xs sm:text-sm text-gray-600">{formatDate(props.weatherData.date)}</div>
  </div>
</div>
  );
};

export default WeatherInfo;