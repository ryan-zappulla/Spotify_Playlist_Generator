import spotifyWebApi from 'spotify-web-api-node';

//This is required to import a json file in ES6
//TODO: Replace this with environment variables for when we are running in the Lambda
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const config = require('./config.json');

export async function handler() {
    let spotify = new SpotifyWebApi();
    console.log(config.var);
}