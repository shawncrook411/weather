var city = "Fairbanks"; //Default place holder
var cityData = {
    condition : '',
    temp : '',
    wind : '',
    humidity : ''
}
var currentDay = dayjs()

var displayConditions = function (data) {
    possible = ['Clear', 'Clouds', '', '', '']
    output = ['', '', '', '', '']
    for (let i = 0; i < possible.length; i++)
    { 
        if (data.condition === possible[i])
        {           
            return output[i]
        }
    }
    return
} 


var 
//function to search for a city
var submitCity = function(){
    
    testCity = $('#search-bar').val()
    if ('' === testCity) //checks if search-bar has data
    {
        console.log("nothing in search bar")
        return
    }
    else
    {
        city = testCity   
        fetchCity(city)         
    }  
}

var fetchCity = function (city)
{
    var requestURL = 'https://api.openweathermap.org/data/2.5/weather?units=imperial&'
    APIkey = '7a1c0f59db2734e48900294d04c1e540'
    localURL = requestURL + 'q=' + city + '&appid=' + APIkey
    console.log(localURL)
    fetch(localURL)
        .then(function (response) 
        {
            return response.json();
        })
        .then(function (data) 
        {
            console.log(data)
            cityData.temp = data.main.temp
            cityData.condition = data.weather[0].main
            cityData.humidity = data.main.humidity
            cityData.wind = data.wind.speed
            console.log(cityData)
            displayData()
        })
        
}

var submitCommonCity = function(event){
    target = event.target
    city = target.textContent
    fetchCity(city)
}

$('#search').on('click', submitCity)

//function to create tabs of cities

cities = ['Atlanta', 'Denver', 'Seattle', 'San Francisco', 'Orlando', 'New York', 'Chicago', 'Austin']
container = $('#common-cities')
for (let i = 0; i < 8; i++)
{
    localDiv = $('<div>')
    localDiv.text(cities[i])
    localDiv.addClass('cities-boxes')
    container.append(localDiv)
    localDiv.on('click', submitCommonCity)
}

//function to display data into the current city conditions

var displayData = function (){

    localContainer = $('#card-container')
    for(let i = 0; i < 5; i++)
    {
        card = $('<div>')
        card.addClass('card')
        card.attr('id', (i + '-day-out'))
        for(let j = 0; j < 5; j++)
        {     
            localDay = currentDay.add((i+1), 'day').format('MMM D, YYYY')
            cardData = [localDay, '', 'Temp: ', 'Wind: ', 'Humidity: ' ]
            cardData[1] = 'image'
            cardData[2] += 0 + ' °F'
            cardData[3] += 0 + ' MPH'
            cardData[4] += 0 + ' %'
            div = $('<div>')
            div.text(cardData[j])
            div.addClass('card-data')
            if(j === 0)
            {
                div.attr("style", "font-weight: bold")
            }
            card.append(div)
        }
        localContainer.append(card)
    }

    localContainer = $('#city-data')
    localContainer.children().eq(0).text('City: ' + city + ' (' + currentDay.format('MMM D, YYYY') + ')' + ' image')
    localContainer.children().eq(1).text('Temp: ' + cityData.temp + ' °F')
    localContainer.children().eq(2).text('Wind: ' + cityData.wind + ' MPH')
    localContainer.children().eq(3).text('Humidity: ' + cityData.humidity + ' %')

}

displayData()
//funtion to create 5 cards based on 5 day forecast