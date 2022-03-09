import { NoopSongLogFacade } from "../src/song_log_facade";
import { handler, Dependencies } from '../src/recent_song_logger_index';
import { Spotify_Song_Provider } from '../src/song_provider';
import { create_spotify } from "../src/spotify_factory";

declare function require(name:string);
const config = require("./config.json");

async function run() {
    let spotify = await create_spotify(config.client_id, config.client_secret, config.refresh_token);
    let dependencies = new Dependencies();
    dependencies.song_provider = new Spotify_Song_Provider(spotify)
    dependencies.song_log_facade = new NoopSongLogFacade("2022-02-26T22:45:33.475Z");
    await handler(dependencies);
}

run();