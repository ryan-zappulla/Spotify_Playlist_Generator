import {handler, Dependencies} from '../src/recent_song_cacher_index.js';
import { Spotify_Song_Provider } from '../src/song_provider.js';
import { create_spotify } from "../src/spotify_factory.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const config = require('../src/config.json');

console.log(config.client_id);
console.log(config.client_secret);
console.log(config.refresh_token);
let spotify = await create_spotify(config.client_id, config.client_secret, config.refresh_token);
let dependencies = new Dependencies();
dependencies.song_provider = new Spotify_Song_Provider(spotify)
await handler(dependencies);