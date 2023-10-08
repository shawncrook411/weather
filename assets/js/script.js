var city =  localStorage.getItem("city") //Default place holder
var cityData = {
    condition : '',
    temp : '',
    wind : '',
    humidity : ''
}
var ForeCast = []
var currentDay = dayjs()
var historyLength = localStorage.getItem('history')
if (historyLength === 0)
{
    historyLength++
}

if (!city)
{
    city = 'SALT LAKE CITY'
}

//function to search for a city
var submitCity = function(){
    
    testCity = $('#search-bar').val()
    if ('' === testCity) //checks if search-bar has data
    {
        console.log("Nothing in search bar")
        return
    }
    else
    {
        city = testCity.toUpperCase()
        localStorage.setItem("city", city)
        localStorage.setItem("city" + historyLength, city)   
        addHistory()
        fetchCity(city)      
         
    } 
    displayHistory() 
}

var addHistory = function (){
    historyLength++
    localStorage.setItem("history", historyLength)
}

var fetchCity = function (city)
{
    var requestURL = 'https://api.openweathermap.org/data/2.5/weather?units=imperial&'
    APIkey = '7a1c0f59db2734e48900294d04c1e540'
    localURL = requestURL + 'q=' + city + '&appid=' + APIkey
    fetch(localURL)
        .then(function (response) 
        {
            return response.json();
        })
        .then(function (data) 
        {
            cityData.temp = data.main.temp
            cityData.condition = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
            cityData.humidity = data.main.humidity
            cityData.wind = data.wind.speed
            fetchForecast(city) 
        })        
}

var fetchForecast = function (city)
{
    ForeCast = []
    var requestURL = 'https://api.openweathermap.org/data/2.5/forecast?units=imperial&'
    APIkey = '7a1c0f59db2734e48900294d04c1e540'
    localURL = requestURL + 'q=' + city + '&appid=' + APIkey
    fetch(localURL)
        .then(function (response) 
        {
            return response.json();
        })
        .then(function (data) 
        {
            for (let i = 1; i <= 5; i++)
            {
                forecastDate = ((i*8)-1) 
                localData = {}
                list = data.list[forecastDate]
                console.log(list)     
                localData.temp = list.main.temp
                localData.condition = 'https://openweathermap.org/img/wn/' + list.weather[0].icon + '@2x.png'
                localData.humidity = list.main.humidity
                localData.wind = list.wind.speed
                ForeCast.push(localData)                
            }
            displayData()
        })        
}

var submitCommonCity = function(event){
    target = event.target
    city = target.textContent
    historyLength++
    fetchCity(city)
}

$('#search').on('click', submitCity)

//function to create tabs of cities
var displayHistory = function () {
    cities = []
    for (let i = 1; i < historyLength; i++)
    {
        addCity = localStorage.getItem("city" + i)
        if(addCity)
        {
            cities.push(addCity)
        }
    }
    container = $('#common-cities')
    children = container.children()
    children.remove()
    for (let i = 0; i < cities.length; i++)
    {
        localDiv = $('<div>')
        localDiv.text(cities[i])
        localDiv.addClass('cities-boxes')
        container.append(localDiv)
        localDiv.on('click', submitCommonCity)
    }
}

//function to display data into the current city conditions

var displayData = function (){

    image = $('<img>')
    image.attr('src', cityData.condition)

    
    localContainer = $('#city-data')
    localContainer.children().eq(0).text('City: ' + city + ' (' + currentDay.format('MMM D, YYYY') + ')')
    localContainer.children().eq(0).append(image)
    localContainer.children().eq(1).text('Temp: ' + cityData.temp + ' °F')
    localContainer.children().eq(2).text('Wind: ' + cityData.wind + ' MPH')
    localContainer.children().eq(3).text('Humidity: ' + cityData.humidity + ' %')
    
    localContainer = $('#card-container')    
    children = localContainer.children()
    children.remove()

    for(let i = 0; i < 5; i++)
    {
        card = $('<div>')
        card.addClass('card')
        card.attr('id', (i + '-day-out'))
        for(let j = 0; j < 5; j++)
        {     
            localDay = currentDay.add((i+1), 'day').format('MMM D, YYYY')
            cardData = [localDay, '', 'Temp: ' + ForeCast[i].temp + ' °F', 'Wind: ' + ForeCast[i].wind + ' MPH', 'Humidity:' + ForeCast[i].humidity + ' %' ]
            
            if (j === 1)
            {
                div = $('<img>')
                div.attr('src', ForeCast[i].condition)
            }
            else
            {
                div = $('<div>')
                div.addClass('card-data')
                div.text(cardData[j])
            }
            if(j === 0)
            {
                div.attr("style", "font-weight: bold")
            }
            card.append(div)
        }
        localContainer.append(card)
    }
    
}

displayHistory()