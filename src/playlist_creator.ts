import SpotifyWebApi = require("spotify-web-api-node");
import _ = require("underscore");
import { Error_Handler } from "./error_handler";

export class Playlist_Creator {
    private spotify: SpotifyWebApi;

    constructor(spotify: SpotifyWebApi) {
        this.spotify = spotify;
    }

    async create_playlist(songs: string[], name: string, isPublic: boolean) : Promise<void>
    {
        let data = await this.spotify.createPlaylist(name, { 'public': isPublic });
        await this.spotify.addTracksToPlaylist(data.body.id, _.shuffle(songs));
    }
}