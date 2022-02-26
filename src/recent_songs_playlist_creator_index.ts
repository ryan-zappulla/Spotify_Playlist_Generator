import _ = require("underscore");
import { Playlist_Creator } from "./playlist_creator";
import { Song_Provider } from "./song_provider";
import { Error_Handler } from "./error_handler"; //TODO: Look into the differences between SpotifyWebApi and these
import { create_spotify } from "./spotify_factory";

//TODO: Replace this with environment variables for when we are running in the Lambda
const config = require('./config.json');

class PlaylistCreateEvent {
    PlaylistName: string
}

export async function handler(event : PlaylistCreateEvent): Promise<void> {
    let playlistName = event?.PlaylistName?.trim() ? event.PlaylistName : `Programmed Playlist - ${new Date().toLocaleString()}`;
    const error_handler = new Error_Handler();

    try {
        const spotify = await create_spotify(config.client_id, config.client_secret, config.refresh_token);
        let song_provider = new Song_Provider(spotify);
        let recentSongs = await song_provider.get_recently_played_songs(50);
        let playlist_creator = new Playlist_Creator(spotify);
        let songs = new Set(
                recentSongs.flatMap(song => `spotify:track:${song.track.id}`) //spotify song ids need to be prefixed with spotify:track:
            ); //Remove duplicates
        await playlist_creator.create_playlist(Array.from(songs), playlistName, false);
    }
    catch (error) {
        error_handler.handle_error(error);
    }
}