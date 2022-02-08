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

    //TODO: Update to return success/failure
    create_playlist(items: SpotifyApi.PlayHistoryObject[], name: string, isPublic: boolean): void {
        console.log('create playlist entered')
        let songs = new Set(items.flatMap(song => `spotify:track:${song.track.id}`)); //Remove duplicates
        songs.forEach(song => {
            console.log(song);
        });
        this.spotify.createPlaylist(name, { 'public': isPublic })
            .then(
                (data) => {
                    let id = data.body.id;
                    this.spotify.addTracksToPlaylist(id, _.shuffle(Array.from(songs)))
                        .then(
                            () => {
                                console.log('Created the playlist!');
                            }, (error) => {
                                this.error_handler.handle_error(error);
                            }
                        );
                },
                (error) => {
                    this.error_handler.handle_error(error);
                }
            );
    }

}