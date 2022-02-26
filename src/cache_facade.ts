import SpotifyWebApi = require("spotify-web-api-node");

export interface CacheFacade {
    most_recent_play_timestamp() : Promise<string>
    save_song_to_cache(song: SpotifyApi.PlayHistoryObject) : Promise<void>;
}

export class DynamoCacheFacade implements CacheFacade {
    save_song_to_cache(song: SpotifyApi.PlayHistoryObject): Promise<void> {
        throw new Error("Method not implemented.");
    }
    most_recent_play_timestamp(): Promise<string> {
        throw new Error("Method not implemented.");
    }
}

export class NoopDynamoCacheFacade implements CacheFacade {

    private timestamp: string;

    constructor (timestamp: string) {
        this.timestamp = timestamp;
    }
    
    save_song_to_cache(song: SpotifyApi.PlayHistoryObject): Promise<void> {
        return new Promise<void>((resolve) => {
            console.log(`Saved ${song.track.name}`);
            resolve();
        });
    }

    most_recent_play_timestamp(): Promise<string> {
        return new Promise<string>((resolve) => {
            resolve(this.timestamp);
        });
    }
}