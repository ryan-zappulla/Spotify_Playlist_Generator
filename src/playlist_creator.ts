import SpotifyWebApi = require("spotify-web-api-node");
import _ = require("underscore");
import { Error_Handler } from "./error_handler";

export class Playlist_Creator {
    private spotify: SpotifyWebApi;
    private error_handler: Error_Handler;

    constructor(spotify: SpotifyWebApi, error_handler : Error_Handler) {
        this.spotify = spotify;
        this.error_handler = error_handler;
    }

    async create_playlist(items: SpotifyApi.PlayHistoryObject[], name: string, isPublic: boolean) : Promise<void>
    {
        let songs = new Set(items.flatMap(song => `spotify:track:${song.track.id}`)); //Remove duplicates
        this.spotify.createPlaylist(name, { 'public': isPublic });
    
        return new Promise(function(resolve, reject) {
            this.spotify.createPlaylist(name, { 'public': isPublic })
                .then(
                    (data) => {
                        let id = data.body.id;
                        this.spotify.addTracksToPlaylist(id, _.shuffle(Array.from(songs)))
                            .then(
                                () => {
                                    console.log('Created the playlist!');
                                    resolve();
                                }, (error) => {
                                    this.error_handler.handle_error(error);
                                    reject(error);
                                }
                            );
                    },
                    (error) => {
                        reject(error);
                    }
                );
        });
    }
}