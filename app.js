const express = require("express") 
const ejs = require("ejs")
const https = require("https")
const app = express()

app.use(express.urlencoded())

app.use(express.static("public"))

app.set('view engine', 'ejs')

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html")
})

app.post("/", function(req, res) {

    // 'https://' must have added before the url in 'https get' function.
    const apiKey = "16ed6633fcea887e51bdb69136117888"
    const city = req.body.cityName;
    const unit = "metric"

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=" + unit;

    https.get(url, function(response) {
        if(response.statusCode === 200) {
            response.on("data", function(data) {
                const weatherData = JSON.parse(data)
                const temp = weatherData.main.temp
                // res.write("<h3>The weather description is " + weatherData.weather[0].description + ".</h3>")
                // res.write("<h1>The temperature in " + city + " is " + temp + " in celsius.</h1>")
                // res.send()
                res.render('list', {cityName: city, cityTemp: temp, cityTempDescription: weatherData.weather[0].description})
            })
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
    });
})

app.post("/failure", function(req, res) {
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function(req, res) {
    console.log("Server is started on port 3000.")
})