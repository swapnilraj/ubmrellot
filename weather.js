var axios = require('axios');

function URL(city, time) {
  if(!city) {
    return { err: 'city missing' };
  } else if (!time) {
    return { url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city +
            '&appid=' + process.env.WTHR_KEY + '&units=metric',
            err: false
           }
  } else {
    return { url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + city +
            '&appid=' + process.env.WTHR_KEY + '&units=metric',
            err: false
           }
  }

}

function formatForecast(resp, time) {
  if(!time) {
    return resp.weather[0].description;
  }

  var DIFFERENCE_OF_3HOURS = 3 * 60 * 60 + 50
    , timeInEpoch = new Date(time).getTime() / 1000; // convert milliseconds to seconds

  for (var i = 0; i < resp.cnt; ++i) {
    var dayWeather = resp.list[i];

    if (Math.abs(dayWeather['dt'] - timeInEpoch) <= DIFFERENCE_OF_3HOURS) {
      return JSON.stringify(dayWeather);
    }
  }
}

async function forecast(city, time) {
  var res = URL(city, time);
  if (res.err) return 'Sorry could not find forecast for your query because ' + url.err;

  var response = await axios(res.url);
      response = await response.data;
  var msg = formatForecast(response, time);
  return msg;
}

module.exports = { forecast };
