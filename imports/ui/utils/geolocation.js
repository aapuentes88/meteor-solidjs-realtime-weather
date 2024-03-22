export const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          reject(error.message);
        }
      );
    } else {
      reject('Geolocation not supported.');
    }
  });
};

export const getCoordinates = async (city) => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=3711ed351cd8264e86e3db88adc15941`,
    {mode: 'cors'});
    
    if (!response.ok) {
      throw new Error(`City not found`);
    }
    const data = await response.json();
    if (data /*&& data.length > 0*/) {
      const location = data.coord;
      return { latitude: parseFloat(location.lat), longitude: parseFloat(location.lon) };
    } else {
      throw new Error('No se encontraron coordenadas para la ciudad proporcionada.');
    }
  } catch (error) {
    throw error;
  }
};

export const getCityAndCountry = async (latitude, longitude) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
    const data = await response.json();
    const { city, country } = data.address;
    return { city, country };
  } catch (error) {
    console.error('Error fetching city and country:', error);
    return null;
  }
};
