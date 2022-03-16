import SpotifyWebApi = require("spotify-web-api-node");
import { Song } from "../domain/song";

export interface Recent_Song_Provider {
    get_recently_played_songs(count?: number) : Promise<Song[]>
    name : string
}

export class Spotify_Song_Provider implements Recent_Song_Provider {
    private spotify: SpotifyWebApi;
    
    constructor(spotify: SpotifyWebApi) {
        this.spotify = spotify;
        this.name = "spotify";
    }

    readonly name: string;

    async get_recently_played_songs(count?: number) : Promise<Song[]>
    {
        const maxCount = 50;
        if(count == undefined)
        {
            count = maxCount;
        }
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
        return response.body.items.flatMap(spotify_play => this.spotify_play_to_song(spotify_play));
    }

    private spotify_play_to_song(spotify_play: SpotifyApi.PlayHistoryObject): Song {
        return new Song(spotify_play.track.id, spotify_play.played_at, spotify_play.track.name);
    }
}