import { Meteor } from 'meteor/meteor';

import "/imports/api/weather/collection";
import "/imports/api/weather/methods";
import "/imports/api/weather/publications";
import { Request } from '../server/weather/request'
import { Monitor } from '../server/weather/monitor'

Meteor.startup(() => {
  // Aquí va tu código de inicialización de Meteor, configuraciones, etc.

  // Definir el método para inicializar el monitor
  Meteor.methods({
    async initMonitor( city) {
      try {
        const { myWeather } = Meteor.settings.monitors;
        await Monitor.prepare();
        // const currentMonitorCustomUrl = `${myWeather.url}weather?lat=${latitude}&lon=${longitude}&appid=${myWeather.apikey}`
        // const forecastMonitorCustomUrl = `${myWeather.url}forecast?lat=${latitude}&lon=${longitude}&appid=${myWeather.apikey}`
        const currentMonitorCustomUrl = `${myWeather.url}weather?q=${city}&appid=${myWeather.apikey}`
        const forecastMonitorCustomUrl = `${myWeather.url}forecast?q=${city}&appid=${myWeather.apikey}`


        const monitor = async () => {          
          const request = new Request({ ...myWeather, url:currentMonitorCustomUrl });
          await request.fire();
          await Monitor.addWeather(request.toWeatherDocument());
        };

        const forecast = async () => {          
          const request = new Request({ ...myWeather, url:forecastMonitorCustomUrl });
          await request.fire();
          await Monitor.addForecast(request.toForecastDocument());
        };

        await monitor();
        await forecast();
        Monitor.setIdentifier(Meteor.setInterval(monitor, myWeather.interval))
        Monitor.setForecastIdentifier(Meteor.setInterval(forecast, myWeather.forecastInterval))
      } catch (error) {
        console.error('Error al iniciar el monitor:', error);
        throw new Meteor.Error('init-monitor-failure', 'Error al iniciar el monitor');
      }
    },

    async stopMonitor() {
      try {
        await Monitor.stop()
      } catch (error){
        throw new Meteor.Error('stop-monitor-failure', 'Error al detener el monitor');
      }
    }
  });
});
