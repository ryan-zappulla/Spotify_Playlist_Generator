import { Recent_Song_Provider, Spotify_Song_Provider } from "./infrastructure/song_provider";
import { Song } from "./domain/song";
import { Error_Handler } from "./infrastructure/error_handler";
import { create_spotify } from "./infrastructure/spotify_factory";
import { SongLogFacade, DynamoSongLogFacade, LoggedSong } from "./infrastructure/song_log_facade";

export class Dependencies {
    error_handler : Error_Handler
    song_provider : Recent_Song_Provider
    song_log_facade  : SongLogFacade
}

//This handler is used as the lambda entry point and generates dependencies to be passed into handler
export async function lambda_handler() : Promise<void> {
    const dependencies = new Dependencies();
    dependencies.error_handler = new Error_Handler();
    try {
        const spotify = await create_spotify(process.env.client_id, process.env.client_secret, process.env.refresh_token);
        const user = await spotify.getMe();
        dependencies.song_provider = new Spotify_Song_Provider(spotify);
        dependencies.song_log_facade = new DynamoSongLogFacade(process.env.dynamo_log_name, user.body.id);
    }
    catch (error) {
        dependencies.error_handler.handle_error(error);
    }
    await handler(dependencies);
}

export async function handler(dependencies : Dependencies): Promise<void> {
    let songsSinceLastSave: Song[];
    try {
        let recentSongs = await dependencies.song_provider.get_recently_played_songs();
        let mostRecentSave = await dependencies.song_log_facade.most_recent_play_timestamp();
        songsSinceLastSave = recentSongs.filter(x => x.played_timestamp_utc > mostRecentSave);
    }
    catch (error) {
        dependencies.error_handler.handle_error(error);
        return;
    }
    console.info(`Saving ${songsSinceLastSave.length} songs`);
    let providerName = dependencies.song_provider.name;
    for (const song of songsSinceLastSave) {
        try {
            await dependencies.song_log_facade.log_song_play(new LoggedSong(song.id, song.played_timestamp_utc, song.name, providerName));
        }
        catch (error) {
            dependencies.error_handler.handle_error(error);
        }
    }
}