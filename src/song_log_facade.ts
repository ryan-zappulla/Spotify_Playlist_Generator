require("spotify-web-api-node");
import { DynamoDB } from "aws-sdk";

export interface SongLogFacade {
    most_recent_play_timestamp() : Promise<string>;
    log_song_play(song: SpotifyApi.PlayHistoryObject) : Promise<void>;
}

export class DynamoSongLogFacade implements SongLogFacade {
    private client: DynamoDB.DocumentClient;
    private table_name: string;
    private user_id: string;

    constructor (table_name: string, user_id: string) {
        this.client = new DynamoDB.DocumentClient();
        this.user_id = user_id;
        this.table_name = table_name;
    }

    async log_song_play(song: SpotifyApi.PlayHistoryObject): Promise<void> {
        var document = {
            TableName: this.table_name,
            Item: {
              'user_id' : {S: this.user_id},
              'time_played_utc' : {S: song.played_at},
              'song_name': {S: song.track.name}
            }
          };
        this.client.put(document, function(err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data);
            }
        });
    }
    most_recent_play_timestamp(): Promise<string> {
        return new Promise<string>((resolve) => {
            resolve("");
        });
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