import SpotifyWebApi = require("spotify-web-api-node");

export class Song_Provider {
    private spotify: SpotifyWebApi;

    constructor(spotify: SpotifyWebApi) {
        this.spotify = spotify;
    }

    async get_recently_played_songs(count: number) : Promise<SpotifyApi.PlayHistoryObject[]>
    {
        let response = await this.spotify.getMyRecentlyPlayedTracks(
            { 
                limit: count //50 is the limit, add pagination
            });
        return response.body.items;
    }
}