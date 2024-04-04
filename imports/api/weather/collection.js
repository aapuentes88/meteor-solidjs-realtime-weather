import { Mongo } from 'meteor/mongo';

export const WeatherCollection = new Mongo.Collection('weather');
export const ForecastCollection = new Mongo.Collection('forecast');



