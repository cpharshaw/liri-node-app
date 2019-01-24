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
    });
}


const concertCall = (param = "Muse") => {
    axios.get("https://rest.bandsintown.com/artists/" + param + "/events?app_id=codingbootcamp")
        .then((response) => {
            let data = response.data;
            let apiHeader = "\r\n" + "*--------------------------------------------" + "\r\n" + "         BandsInTown API (" + command + ") " + "\r\n" + "--------------------------------------------*" + "\r\n";
            let header = "*** " + param + " - upcoming concerts provided by BandsInTown ***";
            let blank = "";

            console.log(apiHeader);
            apiToTxt(apiHeader);

            console.log(header);
            console.log(blank);
            apiToTxt(header);
            apiToTxt(blank);
            data.forEach(element => {
                let venueName = "Venue: " + element.venue.name;
                let venueLoc = "Location: " + element.venue.city.trim() + ", " + element.venue.country.trim();
                let date = "Date/time: " + moment(element.datetime).format("MM/DD/YYYY");
                let divider = "------------------------------";
                console.log(venueName);
                console.log(venueLoc)
                console.log(date);
                console.log(divider);
                apiToTxt(venueName);
                apiToTxt(venueLoc);
                apiToTxt(date);
                apiToTxt(divider);
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

        let artist = "Artist: " + song.album.artists[0].name;
        let songName = "Song: " + song.name;
        let songLink = "Link to song: " + song.external_urls.spotify;
        let album = "Album: " + song.album.name;

        let apiHeader = "\r\n" + "*--------------------------------------------" + "\r\n" + "         Spotify API (" + command + ") " + "\r\n" + "--------------------------------------------*" + "\r\n";

        apiToTxt(apiHeader);
        console.log(apiHeader)

        let blank = "";
        let header = "*** " + param + " - song info provided by Spotify ***";
        console.log(header);
        console.log(blank);
        apiToTxt(header);
        apiToTxt(blank);


        console.log(artist);
        console.log(songName);
        console.log(songLink);
        console.log(album);
        console.log(blank);
        apiToTxt(artist);
        apiToTxt(songName);
        apiToTxt(songLink);
        apiToTxt(album);
    });
}



const omdbCall = (param = "Mr. Nobody") => {
    axios.get("https://www.omdbapi.com/?t=" + param + "&y=&plot=short&apikey=74120215")
        .then((response) => {

            let res = response.data;
            let apiHeader = "\r\n" + "*--------------------------------------------" + "\r\n" + "               OMDb API (" + command + ") " + "\r\n" + "--------------------------------------------*" + "\r\n";
            let header = "*** " + param + " - movie info provided by OMDb ***";
            let blank = "";

            console.log(apiHeader);
            apiToTxt(apiHeader);

            console.log(header);
            console.log(blank);
            apiToTxt(header);
            apiToTxt(blank);

            let title = "Title: " + res.Title;
            let year = "Release Year: " + res.Year;
            let imdbRating = "IMDb Rating: " + res.Ratings[0].Value;
            let rtRating = "Rotten Tomatoes rating: " + res.Ratings[1].Value;
            let country = "Country: " + res.Country;
            let language = "Language(s): " + res.Language;
            let plot = "Plot: " + res.Plot;
            let actors = "Actors: " + res.Actors;

            let divider = "------------------------------";

            console.log(title);
            console.log(year)
            console.log(imdbRating);
            console.log(rtRating);
            console.log(country);
            console.log(language)
            console.log(plot);
            console.log(actors);
            console.log(divider);
            apiToTxt(title);
            apiToTxt(year);
            apiToTxt(imdbRating);
            apiToTxt(rtRating);
            apiToTxt(country);
            apiToTxt(language);
            apiToTxt(plot);
            apiToTxt(actors);
            apiToTxt(divider);
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