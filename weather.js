var axios = require('axios');

function URL(city, time) {
  if (!city || !time) return { err: 'City or time missing' }
  return 'https://api.openweathermap.org/data/2.5/weather?q=' + city +
         'appid=' + process.env.WTHR_KEY;
}

function formatForecast(resp) {
  return resp.weather.description;
}

async function forecast(city, time) {
  var url = URL(city, time);
  if (url.err) return 'Sorry could not find forecast for your query';

  var response = await axios(url);
  var msg = formatForecast(response);
  return msg + 'You asked for ' + time + ' but I didn\'t implement that lol';
}

module.exports = { forecast };
