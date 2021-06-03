var userInput = "Orlando";
var weatherApi =
  "https://api.openweathermap.org/data/2.5/weather?q=" +
  userInput +
  "&unit=imperial&appid=26df59715799458d7536afd82b112330";

function lonLat() {
  fetch(weatherApi)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          var coordLat = data.coord.lat;
          var coordLon = data.coord.lon;
          return oneCallApi(coordLat, coordLon);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect");
    });
}

function oneCallApi(lat, lon) {
  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&unit=imperial&appid=26df59715799458d7536afd82b112330"
  )
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(response);
          console.log(data);
          console.log(data.current.humidity);
          var humidity = data.current.humidity;
          weatherDisplay(humidity);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect");
    });
}

function weatherDisplay(data) {
  $("<div>").attr("class", "col-2").text(data).appendTo("#weather");
  $("<div>").attr("class", "col-2").text(data).appendTo("#weather");
  $("<div>").attr("class", "col-2").text(data).appendTo("#weather");
  $("<div>").attr("class", "col-2").text(data).appendTo("#weather");
  $("<div>").attr("class", "col-2").text(data).appendTo("#weather");
  $("<div>").attr("class", "col-2").text(data).appendTo("#weather");
}

lonLat();
