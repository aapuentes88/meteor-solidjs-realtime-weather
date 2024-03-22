import { Meteor } from "meteor/meteor";

import { WeatherCollection, ForecastCollection } from "./collection";

// Definir la publicación para la información del tiempo
Meteor.publish('current_weather', function ({ coordinates }) {
  return WeatherCollection.find({ coordinates }, { sort: { createdAt: -1 }, limit: 1 } );
});

Meteor.publish('forecast_weather', function (/*{ coordinates }*/) {
  return ForecastCollection.find({ /*coordinates*/ }, { sort: { createdAt: -1 }, limit: 1, fields: { list: 1 } } );
});