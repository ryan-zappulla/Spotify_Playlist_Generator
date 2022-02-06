import SpotifyWebApi = require("spotify-web-api-node");
import _ = require("underscore");

//TODO: Replace this with environment variables for when we are running in the Lambda
const config = require('./config.json');

export async function handler(): Promise<void> {
    const spotify = await(initialize_spotify());
    spotify
        .getMyRecentlyPlayedTracks(
            { 
                limit: 50 //This is the limit, I can get more via pagination if I want
            }) 
        .then(
            (response) => {
                let songs = new Set(response.body.items.flatMap(song => `spotify:track:${song.track.id}`)); //Remove duplicates
                songs.forEach(song => {
                    console.log(song);
                });
                spotify.createPlaylist(`Programmed Playlist - ${new Date().toLocaleString()}`, { 'public': false })
                .then(
                    (data) => {
                        let id = data.body.id;
                        spotify.addTracksToPlaylist(id, _.shuffle(Array.from(songs)))
                        .then(
                            () => {
                                console.log('Created the playlist!');
                            }, (error) => {
                                handle_error(error);
                            }
                        );
                    }, 
                    (error) => {
                        handle_error(error)
                    }
                );
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

function handle_error(error): void
{
    console.log(error);
}