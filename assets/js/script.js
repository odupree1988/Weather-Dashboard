var cityName

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
    locationHistory = JSON.parse(localHistory)
    return true 
  } 
  return false
}

function renderWeather(lat, lon){
  getLatLon()

}

$(function(){
  if(checkHistory()){
    const tempLocation = locationHistory[locationHistory.length-1]
    oneCallApi(tempLocation.lat, tempLocation.lon)
  }
  cardDeck();
  $.each(locationHistory, function(key, item){
    $(".history").append("<div class='row recall'><button data-lat='" + item.lat + "' data-lon='" + item.lon + "'>" + item.city + "</button></div>")
  })
  $(".search").on("click", function(e){
    $(".list-group-item").remove();
    $("#weatherInfo").empty()
    var searchQuery = $(".searchQuery").val()
    getLatLon(searchQuery);
  })
  $(".history").on("click", ".recall button", function(){
    var $this = $(this)
    $(".list-group-item").remove();
    $("#weatherInfo").empty()
    oneCallApi($this.data("lat"), $this.data("lon"))
  })
})

function getLatLon(userInput) {
  cityName = userInput
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
          locationObject.city = data.name;
          locationObject.lat = coordLat
          locationObject.lon = coordLon
          locationHistory.push(locationObject)
          updateLocalStorage("history", JSON.stringify(locationHistory))
          $(".history").append("<div class='row recall'><button data-lat='" + locationObject.lat + "' data-lon='" + locationObject.lon + "'>" + locationObject.city + "</button></div>")
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
  $("<div>").attr("class", "list-group-item").text(cityName + date).prependTo(".currentWeather")
}

function fiveDayDisplay(i, data) {
  $("<div>").attr("class", "list-group-item").text(data.date).appendTo("#infoCard" + i);
  $("<img>").attr("src", data.iconUrl).attr("class", "list-group-item").appendTo("#infoCard" + i);
  $("<div>").attr("class", "list-group-item").text("Temp: " + data.dailyTemp + " \u00B0F").appendTo("#infoCard" + i);
  $("<div>").attr("class", "list-group-item").text("Humidity: " + data.humidity + "%").appendTo("#infoCard" + i);
  $("<div>").attr("class", "list-group-item").text("Wind Speed: " + data.windSpeed + " MPH").appendTo("#infoCard" + i);
}