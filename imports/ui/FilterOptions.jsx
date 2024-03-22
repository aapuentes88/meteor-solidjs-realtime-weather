import { createSignal } from 'solid-js';
import { getCoordinates } from "./utils/geolocation";

export const FilterOptions = (props) => {
  // Estado local para almacenar los valores del input
  const [city, setCity] = createSignal('');

  // Función para manejar cambios en el input de la ciudad
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  // Función para enviar los parámetros de monitoreo al servidor
  const handleSubmit = () => {

    props.stopSubcription()
    
    Meteor.call('stopMonitor',  (error, result) => {
      if (error) {
        console.error('Error al detener el monitor:', error);
      } else {
        console.log('Monitor detenido con éxito', result);
      }
    });

    // props.handleFilterOptions({lon: 32.653226, lat: -79.3831843})
    getCoordinates(city()).then(coordinates => {
      props.handleFilterOptions({lon: coordinates.longitude, lat: coordinates.latitude})
      setCity('')

    }).catch(error => {
      props.handleError(error.toString())
    });
  };

  return (
    <div>
      <input className="m-1 city-input pl-4" type="text" id="city" value={city()} onInput={handleCityChange} />
      <button /*className=" btn-search m-1"*/ className="text-white font-bold py-2 px-4 rounded-full btn-search" onClick={handleSubmit}>Search</button>
    </div>
  );
};