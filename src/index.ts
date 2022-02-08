import SpotifyWebApi = require("spotify-web-api-node");
import _ = require("underscore");
import Playlist_Creator = require("./playlist_creator");

//TODO: Replace this with environment variables for when we are running in the Lambda
const config = require('./config.json');

export async function handler(): Promise<void> {
    const spotify = await(initialize_spotify());
    spotify
        .getMyRecentlyPlayedTracks(
            { 
                limit: 50 //This is the limit, I can get more via pagination if I want
            }) 
        .then(
            (response): void => {
                let playlist_creator = new Playlist_Creator.PlaylistCreator(spotify);//TODO: Look into Nodes naming standards at some point
                playlist_creator.create_playlist(response.body.items, `Programmed Playlist - ${new Date().toLocaleString()}`, false);
            },
            (error) => {
                handle_error(error);
            }
        );
}

async function initialize_spotify(): Promise<SpotifyWebApi>
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
                    handle_error(error);
                    reject(error);
                },
            );
    });
}