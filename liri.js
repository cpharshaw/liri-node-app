require("dotenv").config();
const keys = require("./keys.js");

const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
// const inquirer = require('inquirer');
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");



const argsArr = process.argv.slice(2);

const command = argsArr[0];
const param = argsArr.slice(1).join(" ").trim();


const apiToTxt = async (textToLog) => {
    fs.appendFile("liri-log.txt", textToLog + "\r\n", (err) => {
        if (err) {
            return console.log(err)
        }
    });
}


const concertCall = (param) => {
    axios.get("https://rest.bandsintown.com/artists/" + param + "/events?app_id=codingbootcamp")
        .then(function (response) {
            let data = response.data;
            let apiHeader = "\r\n" + "*--------------------------------------------" + "\r\n" + "         BandsInTown API (" + command + ") " + "\r\n" + "--------------------------------------------*" + "\r\n";

            apiToTxt(apiHeader);
            console.log(apiHeader)

            let blank = "";
            let header = "*** " + param + "'s upcoming concerts ***";
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
        .catch(function (error) {
            console.log(error);
        })
};



const spotifyCall = (param) => {
    spotify.search({ 
        type: 'track', 
        query: param
    }, function (err, data) {
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
        let header = "*** " + param + "'s song info ***";
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



// concertCall(param);
spotifyCall(param);
