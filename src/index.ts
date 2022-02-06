import SpotifyWebApi from 'spotify-web-api-node';

//TODO: Replace this with environment variables for when we are running in the Lambda
const config = require('./config.json');

export async function handler() {
    const spotify = await(initialize_spotify());
    spotify
        .getMyRecentlyPlayedTracks(
            { 
                limit: 50 //This is the limit, I can get more via pagination if I want
            }) 
        .then(
            (response) => {
                let songs = new Set(response.body.items.flatMap(song => song.track.name)); //Remove duplicates
                songs.forEach(song => {
                    console.log(song);
                });
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

function handle_error(error)
{
    console.log(error);
}