require("dotenv").config();
var keys = require("./keys.js");
const axios = require('axios');
var Spotify = require('node-spotify-api')
var fs = require('fs');
var moment = require('moment');

var spotify = new Spotify(keys.spotify);

var operator = process.argv[2];
var name = process.argv.slice(3).join(' ');

function play(operator) {
    switch (operator) {
        case 'concert-this':
            concert();
            saveOperation();
            break;
        case 'spotify-this-song':
            spotifySong();
            saveOperation();
            break;
        case 'movie-this':
            movie();
            saveOperation();
            break;
        case 'do-what-it-says':
            dwis();
            saveOperation();
            break;
    }
}
play(operator, name);

function concert() {
    var url = "https://rest.bandsintown.com/artists/" + name + "/events?app_id=codingbootcamp";
    axios.get(url)
        .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                console.log("-------------------------------------------------")
                console.log("Name of the venue: " + response.data[i].venue.name);
                console.log("Venue location: " + response.data[i].venue.city + ', ' + response.data[i].venue.country);
                console.log("Date of the Event: " + moment(response.data[i].datetime).format("MM/DD/YYYY") );
                console.log("-------------------------------------------------")
            }
        })

}

function spotifySong() {
    if (!name) {
        name = 'The Sign Ace of Base'
    }
    spotify
        .search({
            type: 'track',
            query: name
        })
        .then(function (response) {
            var artists = [];
            for (var i = 0; i < response.tracks.items[0].artists.length; i++) {
                artists.push(response.tracks.items[0].artists[i].name)
            }
            console.log("-------------------------------------------------")
            console.log("Artist : " + artists);
            console.log("The song's name: " + response.tracks.items[0].name);
            console.log("Preview link: " + response.tracks.items[0].preview_url);
            console.log("Album: " + response.tracks.items[0].album.name);
            console.log("-------------------------------------------------")
        })
        .catch(function (err) {
            console.log(err);
        });
}

function movie() {
    if (!name) {
        name = 'Mr. Nobody'
    }
    axios.get('http://www.omdbapi.com/?apikey=trilogy&t=' + name)
        .then(function (response) {
            console.log("-------------------------------------------------")
            console.log('Title: ' + response.data.Title);
            console.log('Year: ' + response.data.Year);
            console.log('IMDB Rating: ' + response.data.imdbRating);
            console.log('Rotten Tomatoes Rating: ' + response.data.Ratings[1].Value);
            console.log('Country: ' + response.data.Country);
            console.log('Language: ' + response.data.Country);
            console.log('Plot: ' + response.data.Plot);
            console.log('Actors: ' + response.data.Actors);
            console.log("-------------------------------------------------")
        })
        .catch(function (err) {
            console.log(err);
        });
}

function dwis() {
    fs.readFile('random.txt', function (err, data) {
        if (err) {
            throw err;
        }
        operator = data.toString().split(',')[0];
        name = data.toString().split(',')[1];
        play(operator, name);
    });

}

function saveOperation() {
    fs.appendFile('log.txt', operator + ' : ' + name + '\n', function (err) {
        if (err) {
            throw err;
        }
        console.log('Saved!');
    });
}