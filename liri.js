require("dotenv").config();
var keys = require("./keys.js");
const axios = require('axios');
var Spotify = require('node-spotify-api')
var fs = require('fs');

var spotify = new Spotify(keys.spotify);
var operator = process.argv[2];
var name = process.argv.slice(3).join(' ');

switch (operator) {
    case 'concert-this':
        concert(name);
        break;
    case 'spotify-this-song':
        spotifySong(name);
        break;
    case 'movie-this':
        movie(name);
        break;
    case 'do-what-it-says':
        dwis(name);
        break;
}

function concert(name) {
    var url = "https://rest.bandsintown.com/artists/" + name + "/events?app_id=codingbootcamp";
    axios.get(url)
        .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                console.log("-------------------------------------------------")
                console.log("Name of the venue: " + response.data[i].venue.name);
                console.log("Venue location: " + response.data[i].venue.city + ', ' + response.data[i].venue.country);
                console.log("Date of the Event: " + response.data[i].datetime);
                console.log("-------------------------------------------------")
            }
        })
}

function spotifySong(name) {
    if (!name) {
        name = 'The Sign'
    }
    spotify
        .search({
            type: 'track',
            query: name
        })
        .then(function (response) {
            var artists = [];
            for (var i = 0; i < response.tracks.items.length; i++) {
                if (response.tracks.items[i].artists[0] === 'Ace of Base') {
                    for (var j = 0; j < response.tracks.items[
                            0].artists.length; j++) {
                        artists.push(response.tracks.items[0].artists[j].name)
                    }
                    console.log("-------------------------------------------------")
                    console.log("Artist : " + artists);
                    console.log("The song's name: " + response.tracks.items[i].name);
                    console.log("Preview link: " + response.tracks.items[i].preview_url);
                    console.log("Album: " + response.tracks.items[i].album.name);
                    console.log("-------------------------------------------------")
                }
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function movie(name) {
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

function dwis(name) {

}