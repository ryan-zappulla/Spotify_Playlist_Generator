require("spotify-web-api-node");

export interface SongLogFacade {
    most_recent_play_timestamp() : Promise<string>;
    log_song_play(song: SpotifyApi.PlayHistoryObject) : Promise<void>;
}

export class DynamoSongLogFacade implements SongLogFacade {
    log_song_play(song: SpotifyApi.PlayHistoryObject): Promise<void> {
        throw new Error("Method not implemented.");
    }
    most_recent_play_timestamp(): Promise<string> {
        throw new Error("Method not implemented.");
    }
}

export class NoopSongLogFacade implements SongLogFacade {

    private timestamp: string;

    constructor (timestamp: string) {
        this.timestamp = timestamp;
    }

    log_song_play(song: SpotifyApi.PlayHistoryObject): Promise<void> {
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