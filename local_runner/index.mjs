import { createRequire } from "module";
import { NoopDynamoCacheFacade } from "../src/cache_facade.js";
import { handler, Dependencies } from '../src/recent_song_cacher_index.js';
import { Spotify_Song_Provider } from '../src/song_provider.js';
import { create_spotify } from "../src/spotify_factory.js";
const require = createRequire(import.meta.url);
const config = require('../src/config.json');

let spotify = await create_spotify(config.client_id, config.client_secret, config.refresh_token);
let dependencies = new Dependencies();
dependencies.song_provider = new Spotify_Song_Provider(spotify)
dependencies.cache_facade = new NoopDynamoCacheFacade("2022-02-26T22:45:33.475Z");
await handler(dependencies);