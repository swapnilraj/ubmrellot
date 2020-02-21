var axios = require('axios');

// Decide which url to use for weather API, based on if a time is specified or
// not
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

// Format the response from the weather API
// If a time is specified return forecast closest to 3 hour to the time
function formatForecast(resp, time) {
  if(!time) {
    return resp.weather[0].description;
  }

  var DIFFERENCE_OF_3HOURS = 3 * 60 * 60 + 50
    , timeInEpoch = new Date(time).getTime() / 1000; // convert milliseconds to seconds

  for (var i = 0; i < resp.cnt; ++i) {
    var dayWeather = resp.list[i];

    if (Math.abs(dayWeather['dt'] - timeInEpoch) <= DIFFERENCE_OF_3HOURS) {
      return JSON.stringify(dayWeather); // JSON good
    }
  }
}

// Fetch the forecast for a city
// Can lookup the forecast for a city for a specific time
// Will fetch the forecast for the current time if time is not specified
async function forecast(city, time) {
  var res = URL(city, time);
  if (res.err) return 'Sorry could not find forecast for your query because ' + url.err;

  var response = await axios(res.url);
      response = await response.data;
  var msg = formatForecast(response, time);
  return msg;
}

module.exports = { forecast };
