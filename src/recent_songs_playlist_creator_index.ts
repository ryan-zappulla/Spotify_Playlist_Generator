import _ = require("underscore");
import { Playlist_Creator, Spotify_Playlist_Creator } from "./infrastructure/playlist_creator";
import { Recent_Song_Provider, Spotify_Song_Provider } from "./infrastructure/song_provider";
import { Error_Handler } from "./error_handler";
import { create_spotify } from "./infrastructure/spotify_factory";

export class PlaylistCreateEvent {
    PlaylistName: string
}

export class Dependencies {
    error_handler : Error_Handler
    song_provider : Recent_Song_Provider
    playlist_creator : Playlist_Creator
}

//This handler is used as the lambda entry point and generates dependencies to be passed into handler
export async function lambda_handler(event : PlaylistCreateEvent) : Promise<void> {
    const dependencies = new Dependencies();
    dependencies.error_handler = new Error_Handler();
    try {
        const spotify = await create_spotify(process.env.client_id, process.env.client_secret, process.env.refresh_token);
        dependencies.playlist_creator = new Spotify_Playlist_Creator(spotify);
        dependencies.song_provider = new Spotify_Song_Provider(spotify);
    }
    catch (error) {
        dependencies.error_handler.handle_error(error);
    }
    await handler(event, dependencies);
}

//This handler is called by lambda_handler, and is useful for dependency injecting for local development
export async function handler(event : PlaylistCreateEvent, dependencies : Dependencies): Promise<void> {
    let playlistName = event?.PlaylistName?.trim() ? event.PlaylistName : `Programmed Playlist - ${new Date().toLocaleString()}`;
    try {
        let recentSongs = await dependencies.song_provider.get_recently_played_songs();
        let songs = new Set(
                //TODO: This should really be abstracted to some other layer
                //spotify song ids need to be prefixed with spotify:track:
                recentSongs.flatMap(song => `spotify:track:${song.id}`)
            ); //Remove duplicates
        await dependencies.playlist_creator.create_playlist(_.shuffle(Array.from(songs)), playlistName, false);
    }
    catch (error) {
        dependencies.error_handler.handle_error(error);
    }
}