import { fetch } from 'meteor/fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';

export class Request {
  constructor({ url, proxy, method, timeout }) {
    // config
    this.method = method;
    this.url = url;
    this.proxy = proxy;
    this.timeout = timeout;

    this.response = null;

    this.error = null;
    this.hasTimedOut = null;
  }

  async fire() {
    try {
      const options = this.proxy
        ? {
            method: this.method,
            mode: 'cors',
            agent: new HttpsProxyAgent(this.proxy), // Configurar el proxy aquí
          }
        : {
            method: this.method,
            mode: 'cors',
          };

      const response = await fetch(this.url, options);

      if (!response.ok) {
        console.log(`Error: ${response.status} - ${response.statusText}`);
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      this.response = await response.json(); // Suponiendo que la respuesta es JSON
    } catch (error) {
      console.log(`Error: ${response.status} - ${response.statusText}`);
      this.error = error.toString();
    }
  }

  toWeatherDocument() {
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
      error: this.error,
    };

    document.main.temp = (document.main.temp - 273.15).toFixed(2);
    document.main.feels_like = (document.main.feels_like - 273.15).toFixed(2);
    document.main.temp_min = (document.main.temp_min - 273.15).toFixed(2);
    document.main.temp_max = (document.main.temp_max - 273.15).toFixed(2);

    return document;
  }

  toForecastDocument() {
    const document = {
      coordinates: this.response?.city.coord,
      createdAt: new Date(),
      city: this.response?.city.name,
      list: this.response?.list.sort((a, b) => a.dt - b.dt).slice(0, 9),
      hasTimedOut: !!this.hasTimedOut,
      error: this.error,
    };

    return document;
  }
}
