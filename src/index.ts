import SpotifyWebApi = require("spotify-web-api-node");
import _ = require("underscore");
import { Playlist_Creator } from "./playlist_creator";
import { Error_Handler } from "./error_handler"; //TODO: Look into the differences between SpotifyWebApi and these

//TODO: Replace this with environment variables for when we are running in the Lambda
const config = require('./config.json');

export async function handler(): Promise<void> {
    const error_handler = new Error_Handler();
    const spotify = await(initialize_spotify(error_handler));
    console.log('entered')
    spotify
        .getMyRecentlyPlayedTracks(
            { 
                limit: 50 //This is the limit, I can get more via pagination if I want
            }) 
        .then(
            (response): void => {
                console.log('tracks retrieved')
                let playlist_creator = new Playlist_Creator(spotify, error_handler);//TODO: Look into Nodes naming standards at some point
                playlist_creator.create_playlist(response.body.items, `Programmed Playlist - ${new Date().toLocaleString()}`, false);
            },
            (error) => {
                error_handler.handle_error(error);
            }
        );
}

async function initialize_spotify(error_handler : Error_Handler): Promise<SpotifyWebApi>
{
    let spotify = new SpotifyWebApi();
    spotify.setRefreshToken(config.refresh_token);
    spotify.setClientId(config.client_id);
    spotify.setClientSecret(config.client_secret);

    return new Promise(function(resolve, reject) {
        spotify.refreshAccessToken()
            .then(
                function(response) {    
                    spotify.setAccessToken(response.body.access_token);
                    resolve(spotify);
                },
                function(error) {
                    error_handler.handle_error(error);
                    reject(error);
                },
            );
    });
}