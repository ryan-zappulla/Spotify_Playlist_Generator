import SpotifyWebApi from 'spotify-web-api-node';

//This is required to import a json file in ES6
//TODO: Replace this with environment variables for when we are running in the Lambda
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const config = require('./config.json');

export async function handler() {
    let spotify = initialize_spotify();
    spotify
        .getMyRecentlyPlayedTracks(
            { 
                limit: 50 //This is the limit, I can get more via pagination if I want
            }) 
        .then(
            (response) => {
                let songs = new Set(response.body.items.flatMap(song => song.track.name)); //Remove duplicates
                songs.forEach(song => {
                    console.log(song);
                });
            },
            (error) => {
                console.log(error);
            }
        );
}

function initialize_spotify()
{
    let spotify = new SpotifyWebApi();
    spotify.setAccessToken(config.access_token);
    spotify.setRefreshToken(config.refresh_token);
    return spotify;
}