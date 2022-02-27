import _ = require("underscore");
import { Song_Provider, Spotify_Song_Provider } from "./song_provider";
import { Error_Handler } from "./error_handler";
import { create_spotify } from "./spotify_factory";
import { SongLogFacade, DynamoSongLogFacade } from "./song_log_facade";

export class Dependencies {
    error_handler : Error_Handler
    song_provider : Song_Provider
    song_log_facade  : SongLogFacade
}

//This handler is used as the lambda entry point and generates dependencies to be passed into handler
export async function lambda_handler() : Promise<void> {
    const dependencies = new Dependencies();
    dependencies.error_handler = new Error_Handler();
    try {
        const spotify = await create_spotify(process.env.client_id, process.env.client_secret, process.env.refresh_token);
        dependencies.song_provider = new Spotify_Song_Provider(spotify);
    }
    catch (error) {
        dependencies.error_handler.handle_error(error);
    }
    dependencies.song_log_facade = new DynamoSongLogFacade();
    await handler(dependencies);
}

export async function handler(dependencies : Dependencies): Promise<void> {
    let recentSongs = await dependencies.song_provider.get_recently_played_songs();
    let mostRecentSave = await dependencies.song_log_facade.most_recent_play_timestamp();
    let songsSinceLastSave = recentSongs.filter(x => x.played_at > mostRecentSave);
    songsSinceLastSave.forEach(async song => {
        await dependencies.song_log_facade.log_song_play(song);
    });
}