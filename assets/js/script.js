//user input search function that fires on.click event 'get lat/lon'

var locationHistory = []

function updateLocalStorage(key, data) {
  window.localStorage.setItem(key, data)
}

function getLocalStorage(key) {
 return window.localStorage.getItem(key)
}

function checkHistory() {
  var localHistory = getLocalStorage("history")
  if(localHistory != null) {
    locationHistory = JSON.parse(localHistory).sort((a, b) => a > b ? 1:-1);
  }
  console.log(locationHistory)
}

$(function(){
  checkHistory();
  $.each(locationHistory, function(key, item){
    console.log(key, item.city)
    $(".history").append("<div class='row'><button>" + item.city + "</button></div>")
  })
  $(".search").on("click", function(e){
    var searchQuery = $(".searchQuery").val()
    getLatLon(searchQuery);
  })
})

function getLatLon(userInput) {
  var weatherApi =
  "https://api.openweathermap.org/data/2.5/weather?q=" +
  userInput +
  "&units=imperial&appid=26df59715799458d7536afd82b112330";
  fetch(weatherApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          var coordLat = data.coord.lat;
          var coordLon = data.coord.lon;
          var locationObject = {}
          // console.log(data)
          locationObject.city = data.name;
          locationObject.lat = coordLat
          locationObject.lon = coordLon
          console.log(locationObject)
          locationHistory.push(locationObject)
          console.log(locationHistory)
          updateLocalStorage("history", JSON.stringify(locationHistory))
          $(".history").append("<div class='row'><button>" + locationObject.city + "</button></div>")
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
    "&units=imperial&appid=26df59715799458d7536afd82b112330"
    )
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data)

          for(i = 1; i <= 5; i++){
            const date = (new Date(data.daily[i].dt*1000).toLocaleDateString("en-US"))
            var icon = data.daily[i].weather[0].icon
            const iconUrl = "http://openweathermap.org/img/wn/" + icon + ".png"
            const dailyTemp = data.daily[i].temp.day
            const humidity = data.daily[i].humidity
            const windSpeed = data.daily[1].wind_speed
            weatherDisplay({iconUrl, dailyTemp, date, humidity, windSpeed});
          }
          // var humidity = data.current.humidity;
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
  $("<div>").attr("class", "col-2").text(data.date).appendTo("#weather");
  $("<img>").attr("src", data.iconUrl).appendTo("#weather");
  $("<div>").attr("class", "col-2").text("Temp: " + data.dailyTemp + " \u00B0F").appendTo("#weather");
  $("<div>").attr("class", "col-2").text("Humidity: " + data.humidity + "%").appendTo("#weather");
  $("<div>").attr("class", "col-2").text("Wind Speed: " + data.windSpeed + " MPH").appendTo("#weather");
  // $("<div>").attr("class", "col-2").text(data).appendTo("#weather");
}

// getLatLon(); 


//object destructuring
// const {temperature, humidity} = data.current
// console.log(temperature)  