import { fetch } from 'meteor/fetch'

export class Request {
  constructor ({ url, method, latitude, longitude, apikey, timeout }) {
    // config
    this.method = method
    this.url = url; 
    this.timeout = timeout
 
    this.response = null

    this.error = null
    this.hasTimedOut = null
  }

  async fire () {

    try {
      const response = await fetch(this.url, {
        method: this.method
        // mode: 'cors', 
      });

      if (!response.ok) {
        console.log(`Error: ${response.status} - ${response.statusText}`)
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      this.response = await response.json(); // Suponiendo que la respuesta es JSON

    } catch (error) {
      this.error = error.toString();
    }
  }

  toDocument () {
    const document = {
      coordinates: this.response?.coord,
      createdAt: new Date(),
      city: this.response?.name,
      country: this.response?.sys.country,
      wind: this.response?.wind,
      main: this.response?.main,
      weather: this.response?.weather[0],
      clouds: this.response?.clouds,
      visibility: this.response?.visibility,
      hasTimedOut: !!this.hasTimedOut,
      error: this.error
    }    
    document.main.temp = (document.main.temp - 273.15).toFixed(2)
    document.main.feels_like = (document.main.feels_like - 273.15).toFixed(2)
    document.main.temp_min = (document.main.temp_min - 273.15).toFixed(2)
    document.main.temp_max =  (document.main.temp_max - 273.15).toFixed(2)
   
    return document
  }

  toForecast () {
    const forecast = {
      coordinates: this.response?.city.coord,
      createdAt: new Date(),
      city: this.response?.city.name,
      list: this.response?.list.sort((a, b) => a.dt - b.dt).slice(0,9),
      hasTimedOut: !!this.hasTimedOut,
      error: this.error
    }    
 
    return forecast
  }
}