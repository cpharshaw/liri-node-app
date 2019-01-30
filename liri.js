
require("dotenv").config();
const keys = require("./keys.js");

const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");



const argsArr = process.argv.slice(2);

const command = argsArr[0].trim();
let param = argsArr.slice(1).join(" ").trim();
param = param.length > 0 ? param : undefined;



const apiToTxt = (textToLog) => {
    fs.appendFile("liri-log.txt", textToLog + "\r\n", (err) => {
        if (err) {
            return console.log(err)
        }
        // console.log(textToLog);
    });
}


const concertCall = (param = "Muse") => {
    axios.get("https://rest.bandsintown.com/artists/" + param + "/events?app_id=codingbootcamp")
        .then((response) => {
            let data = response.data;


            let concertTextHeader = [
                "\r\n" + "*--------------------------------------------" + "\r\n" + "         BandsInTown API (" + command + ") " + "\r\n" + "--------------------------------------------*" + "\r\n",
                "*** " + param + " - upcoming concerts provided by BandsInTown ***",
                ""
            ].join("\n");

            apiToTxt(concertTextHeader);
            console.log(concertTextHeader);

            data.forEach((element) => {
                let concertText = [
                    "Venue: " + element.venue.name,
                    "Location: " + element.venue.city.trim() + ", " + element.venue.country.trim(),
                    "Date/time: " + moment(element.datetime).format("MM/DD/YYYY"),
                    "------------------------------"
                ].join("\n");
                apiToTxt(concertText);
                console.log(concertText);
            });


        })
        .catch((error) => {
            console.log(error);
        })
};



const spotifyCall = (param = "The Sign ace of base") => {
    spotify.search({
        type: 'track',
        query: param
    }, (err, data) => {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        let song = data.tracks.items[0];

        let spotifyText = [
            "\r\n" + "*--------------------------------------------" + "\r\n" + "         Spotify API (" + command + ") " + "\r\n" + "--------------------------------------------*" + "\r\n",
            "*** " + param + " - song info provided by Spotify ***",
            "",
            "Artist: " + song.album.artists[0].name,
            "Song: " + song.name,
            "Link to song: " + song.external_urls.spotify,
            "Album: " + song.album.name,
            "",
        ].join("\n");

        apiToTxt(spotifyText);
        console.log(spotifyText);

    });
}



const omdbCall = (param = "Mr. Nobody") => {
    axios.get("https://www.omdbapi.com/?t=" + param + "&y=&plot=short&apikey=74120215")
        .then((response) => {

            let res = response.data;

            let movieTextHeader = [
                "\r\n" + "*--------------------------------------------" + "\r\n" + "               OMDb API (" + command + ") " + "\r\n" + "--------------------------------------------*" + "\r\n",
                "*** " + param + " - movie info provided by OMDb ***",
                ""
            ].join("\n");


            let movieText = [
                "Title: " + res.Title,
                "Release Year: " + res.Year,
                "IMDb Rating: " + res.Ratings[0].Value,
                "Rotten Tomatoes rating: " + res.Ratings[1].Value,
                "Country: " + res.Country,
                "Language(s): " + res.Language,
                "Plot: " + res.Plot,
                "Actors: " + res.Actors,
                "------------------------------"
            ].join("\n");

            apiToTxt(movieTextHeader);
            apiToTxt(movieText);

            console.log(movieTextHeader);
            console.log(movieText);            

        })
        .catch((error) => {
            console.log(error);
        })
};

const random = () => {
    fs.readFile("random.txt", "utf8", (error, data) => {
        if (error) { return console.log(error) };
        var dataArr = data.split(",");
        spotifyCall(dataArr[1]);
    });
}



((command, param) => {
    if (command === "concert-this") {
        concertCall(param);
    } else if (command === "spotify-this-song") {
        spotifyCall(param);
    } else if (command === "movie-this") {
        omdbCall(param);
    } else if (command === "do-what-it-says") {
        random();
    } else {
        console.log("Invalid command.  Available options: 'concert-this', spotify-this-song', 'movie-this', and 'do-what-it-says.'")
    }
})(command, param);