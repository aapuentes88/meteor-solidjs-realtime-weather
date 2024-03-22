import { WeatherCollection, ForecastCollection } from '../../imports/api/weather/collection'

export const Monitor = {}

// Objeto para almacenar el estado del monitor en memoria
const monitorState = {};

// Función para preparar la inicializacion del monitor
Monitor.prepare = async () => {

  Monitor.up = true
  
};

Monitor.setIdentifier =  (id) => {
   Monitor.identifier = id
}

Monitor.setForecastIdentifier =  (id) => {
  Monitor.forecastIdentifier = id
}

Monitor.getIdentifier =  () => {
  return Monitor.identifier
}

Monitor.getForecastIdentifier =  () => {
  return Monitor.forecastIdentifier
}

// Función para actualizar el estado del monitor según el resultado de la última solicitud
Monitor.add = async (document) => {
  
  if(Monitor.up)
  await WeatherCollection.insertAsync(document)
};

Monitor.addForecast = async (document) => {
  if(Monitor.up)
  await ForecastCollection.insertAsync(document)
}

// Función para detener el monitor
Monitor.stop = async ()  => {

  clearInterval(Monitor.getIdentifier())
  clearInterval(Monitor.getForecastIdentifier())

  if(Monitor.up)
    Monitor.up = false
}
