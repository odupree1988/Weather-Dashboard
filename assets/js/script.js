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
    locationHistory = JSON.parse(localHistory).sort((a, b) => a.city > b.city ? 1:-1);
  }
  console.log(locationHistory)
}

$(function(){
  checkHistory();
  $.each(locationHistory, function(key, item){
    console.log(key, item.city)
    $(".history").append("<div class='row' id='searchHistory'><button>" + item.city + "</button></div>")
  })
  $(".search").on("click", function(e){
    $("#weatherInfo").html("")
    $("")
    var searchQuery = $(".searchQuery").val()
    cardDeck()
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
          // locationHistory.filter((item, pos) => locationHistory.indexOf(item) == pos).sort((a,b) => a.city > b.city ? 1 : -1);
          // updateLocalStorage("history", JSON.stringify(locationHistory))
          
          // $('.history').find('.row').remove();
          // $('.history').append(locationHistory.map(location => "<div class='row' id='searchHistory'><button>" + location.city + "</button></div>"))
          console.log(locationHistory)
          updateLocalStorage("history", JSON.stringify(locationHistory))
          $(".history").append("<div class='row' id='searchHistory'><button>" + locationObject.city + "</button></div>")
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

          var date = (new Date(data.current.dt*1000).toLocaleDateString("en-US"))
          var {humidity, temp, uvi, wind_speed, temp} = data.current
          currentDayDisplay(date, {humidity, temp, uvi, wind_speed, temp});
          

          for(i = 1; i <= 5; i++){
            const date = (new Date(data.daily[i].dt*1000).toLocaleDateString("en-US"))
            var icon = data.daily[i].weather[0].icon
            const iconUrl = "http://openweathermap.org/img/wn/" + icon + ".png"
            const dailyTemp = Math.floor(data.daily[i].temp.day)
            const humidity = data.daily[i].humidity
            const windSpeed = data.daily[i].wind_speed
            $("<div>").attr("class", "card").attr("id", "infoCard" + i).appendTo("#weatherInfo")
            fiveDayDisplay(i, {iconUrl, dailyTemp, date, humidity, windSpeed});
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

function cardDeck(){
  $("<div>").attr("class", "card-deck").attr("id", "weatherInfo").appendTo("#weather")
}

function currentDayDisplay(date, data){
  $("<div>").attr("class", "list-group-item").text("UV: " + data.uvi).prependTo(".currentWeather")
  $("<div>").attr("class", "list-group-item").text("Wind Speed: " + data.wind_speed).prependTo(".currentWeather")
  $("<div>").attr("class", "list-group-item").text("Humidity: " + data.humidity + " %").prependTo(".currentWeather")
  $("<div>").attr("class", "list-group-item").text("Temp: " + Math.floor(data.temp) + " \u00B0F").prependTo(".currentWeather")
  $("<div>").attr("class", "list-group-item").text(date).prependTo(".currentWeather")
}

function fiveDayDisplay(i, data) {
  $("<div>").attr("class", "list-group-item").text(data.date).appendTo("#infoCard" + i);
  $("<img>").attr("src", data.iconUrl).attr("class", "list-group-item").appendTo("#infoCard" + i);
  $("<div>").attr("class", "list-group-item").text("Temp: " + data.dailyTemp + " \u00B0F").appendTo("#infoCard" + i);
  $("<div>").attr("class", "list-group-item").text("Humidity: " + data.humidity + "%").appendTo("#infoCard" + i);
  $("<div>").attr("class", "list-group-item").text("Wind Speed: " + data.windSpeed + " MPH").appendTo("#infoCard" + i);
}

// getLatLon(); 


//object destructuring
// const {temperature, humidity} = data.current
// console.log(temperature)  