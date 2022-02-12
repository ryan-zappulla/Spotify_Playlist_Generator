import SpotifyWebApi = require("spotify-web-api-node");
import { APIGatewayProxyEvent } from "aws-lambda";
import _ = require("underscore");
import { Playlist_Creator } from "./playlist_creator";
import { Error_Handler } from "./error_handler"; //TODO: Look into the differences between SpotifyWebApi and these

//TODO: Replace this with environment variables for when we are running in the Lambda
const config = require('./config.json');

export async function handler(event : APIGatewayProxyEvent): Promise<void> {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))
    const error_handler = new Error_Handler();
    try {
        const spotify = await initialize_spotify();
        let recentSongs = await spotify.getMyRecentlyPlayedTracks(
            { 
                limit: 50 //This is the limit, I can get more via pagination if I want
            });
        let playlist_creator = new Playlist_Creator(spotify);
        let songs = new Set(recentSongs.body.items.flatMap(song => `spotify:track:${song.track.id}`)); //Remove duplicates
        await playlist_creator.create_playlist(Array.from(songs), `Programmed Playlist - ${new Date().toLocaleString()}`, false);
    }
    catch (error) {
        error_handler.handle_error(error);
    }
}

async function initialize_spotify(): Promise<SpotifyWebApi> {
    let spotify = new SpotifyWebApi();
    spotify.setRefreshToken(config.refresh_token);
    spotify.setClientId(config.client_id);
    spotify.setClientSecret(config.client_secret);
    let refreshResponse = await spotify.refreshAccessToken();
    await spotify.setAccessToken(refreshResponse.body.access_token);
    return spotify;
}