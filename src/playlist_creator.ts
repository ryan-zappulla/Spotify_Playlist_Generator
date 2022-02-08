import SpotifyWebApi = require("spotify-web-api-node");
import _ = require("underscore");

export class PlaylistCreator {
    private spotify: SpotifyWebApi;

    constructor(spotify: SpotifyWebApi) {
        this.spotify = spotify;
    }

    create_playlist(items: SpotifyApi.PlayHistoryObject[], name: string, isPublic: boolean): void {
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
                                handle_error(error);
                            }
                        );
                },
                (error) => {
                    handle_error(error);
                }
            );
    }

}