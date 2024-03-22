import { createEffect, createSignal, onMount, onCleanup, Show } from 'solid-js';

import { FilterOptions } from "./FilterOptions";
import  ForecastWeatherInfo  from "./ForecastWeatherInfo";
import  WeatherInfo  from "./WeatherInfo";
import  MainInfo  from "./MainInfo";
import { getLocation, getCoordinates, getCityAndCountry } from "./utils/geolocation";

// import { createSignal, For, Show } from "solid-js";
import { Tracker } from "meteor/tracker";
import { Meteor } from "meteor/meteor";
import { WeatherCollection, ForecastCollection } from "../api/weather/collection";

const initWeatherData = {city:'', date: null, main: {} , description: ''}

export const App = () => {

  let track, subscription, forecastSubscription;
  const [isReady, setIsReady] = createSignal(false);
  const [weatherCollection, setWeatherCollection] = createSignal({});
  const [forecastWeatherCollection, setForecastWeatherCollection] = createSignal({});

  const [forecastWeatherData, setForecastWeatherData] = createSignal([]);
  const [weatherData, setWeatherData] = createSignal(initWeatherData);

  // const [latitude, setLatitude] = createSignal(null);
  // const [longitude, setLongitude] = createSignal(null);
  const [coordinates, setCoordinates] = createSignal({lon:null, lat:null});
  const [error, setError] = createSignal(null);
  const [city, setCity] = createSignal(null);


  const fetchWeather = async(coordinates) => {
    return await WeatherCollection.find({coordinates}, { sort: { createdAt: -1 }, limit: 1 }).fetchAsync()
  }

  const fetchForecastWeather = async(coordinates) => {
    return await ForecastCollection.find({/*coordinates*/}, { sort: { createdAt: -1 }, limit: 1, fields: { list: 1 } }).fetchAsync()
  }

  const updateLocation = async () => {
    const position = await getLocation();    
    setCoordinates({lon: position.coords.longitude, lat: position.coords.latitude, })
  }

  const prepareToUpdateDashBoard = async () => {
    const { city: newcity } = await getCityAndCountry(coordinates().lat, coordinates().lon);
    setCity(newcity) 
    track = Tracker.autorun(async () => {
      subscription = Meteor.subscribe("current_weather" , {coordinates: coordinates()});
      forecastSubscription = Meteor.subscribe("forecast_weather" , {coordinates: coordinates()});  
      setIsReady(subscription.ready());
      if (subscription.ready() && forecastSubscription.ready()/*&& city()*/) {
      setWeatherCollection( await fetchWeather(coordinates()))
      setForecastWeatherCollection(await fetchForecastWeather(coordinates()))
      }
    });  
  }

  onMount(async () => {
    await updateLocation()
    await prepareToUpdateDashBoard();
  });

  onCleanup(() => {
    track.stop()
    subscription.stop()
  });

  const stopSubcription = () => {
    track.stop()
    subscription.stop()
    forecastSubscription.stop()
    setIsReady(subscription.ready());
  }

  const handleFilterOptions = async (newCoordinates) => {    
    if(error())setError(null)
    setCoordinates(newCoordinates)
    track = Tracker.autorun(async () => {
      subscription = Meteor.subscribe("current_weather" , {coordinates: coordinates()});   
      forecastSubscription = Meteor.subscribe("forecast_weather" , {coordinates: coordinates()});   
      if (subscription.ready()){
      setWeatherCollection( await fetchWeather(coordinates()))
      setForecastWeatherCollection(await fetchForecastWeather(coordinates()))
      setIsReady(subscription.ready());
      }
    });  
  }

  const handleError = (error) => {
     setError(error)
     setIsReady(true)
  }

  createEffect( () => {
    let lat = coordinates().lat
    let lon = coordinates().lon
    let err =  error()
    // Verificar si las señales de latitud y longitud tienen valores válidos
    if (lat !== null && lon !== null && err === null) {
    Meteor.call('initMonitor', lat, lon, (error, result) => {
        if (error) {
          console.error('Error al iniciar el monitor:', error);
        } else {
          console.log('Monitor iniciado con éxito', result);
        }
     });
    }

  }, [/*latitude, longitude,*/coordinates]);

  createEffect(() => {

    const obj = weatherCollection()[0]
    if(obj && isReady()) {
    const main = {...obj.main, windspeed: obj.wind.speed}
    const wD = {city: obj.city, date: obj.createdAt, 
    description: obj.weather.description, main}
    setWeatherData(wD)
    }
  }, [weatherCollection]);

  createEffect(() => {
    const obj = forecastWeatherCollection()
    if(obj && obj.length > 0 && isReady()) {
      setForecastWeatherData(obj)
    }
  }, [forecastWeatherCollection]);

  return (<div className="mx-auto max-w-screen-lg px-4 sm:px-6">
  <header>
    <div className="bg-gray-800 rounded-md p-4 mb-4">
      <h1 className="text-xl font-bold text-indigo-100 sm:text-2xl text-center">
        DashBoard
      </h1>
    </div>
  </header>
  <div className="border-b border-gray-500 mb-4"></div>
  <Show
    when={isReady()}
    fallback={
      <div className="flex flex-col items-center justify-center">
        <p className="text-sm mb-2">Waiting for location...</p>
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12"></div>
      </div>
    }
  >
    <div className="mt-4 mb-4">
      <FilterOptions stopSubcription={stopSubcription} handleFilterOptions={handleFilterOptions} handleError={handleError}/> 
      {error() &&  <p className="text-red-600">{error()}</p>}
    </div>
    
   
    <div className="grid grid-cols-3 gap-4">
  {/* Contenedor de WeatherInfo y ForecastWeatherInfo */}
  <div className="col-span-1">
    <div className="h-full">
      {/* WeatherInfo */}
      {/* <div className="mb-4"> */}
        <WeatherInfo weatherData={{...weatherData()}} />
      {/* </div> */}
      {/* ForecastWeatherInfo */}
      <div className="m-0">
        <ForecastWeatherInfo forecastWeatherData={{...forecastWeatherData()}} />
      </div>
    </div>
  </div>

  {/* Contenedor de MainInfo */}
  <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
    {Object.entries(weatherData().main).map(([key, value]) => (
      // Ajusta el ancho de MainInfo para que ocupe el doble de espacio
      <div /*className="w-full sm:w-auto" */key={key}>
        <MainInfo name={key} value={value} />
      </div>
    ))}
  </div>
</div>


    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

    </div>  
  </Show>
</div>
)

};