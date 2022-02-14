import SpotifyWebApi = require("spotify-web-api-node");

export class Song_Provider {
    private spotify: SpotifyWebApi;

    constructor(spotify: SpotifyWebApi) {
        this.spotify = spotify;
    }

    async get_recently_played_songs(count: number) : Promise<SpotifyApi.PlayHistoryObject[]>
    {
        const maxCount = 50;
        //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-recently-played
        //This mentions before and after, however that only seems to work at small page sizes, you cannot go more than 50 songs in the past.
        if (count > maxCount)
        {
            throw new RangeError(`Count needs to be ${maxCount} or less, Spotifies Recent Track endpoint cannot go back more than 50 plays.`);
        }
        let response = await this.spotify.getMyRecentlyPlayedTracks(
            { 
                limit: count
            }
        );
        return response.body.items;
    }
}