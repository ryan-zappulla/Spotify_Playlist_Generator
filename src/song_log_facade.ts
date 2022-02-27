require("spotify-web-api-node");
import { DynamoDBClient, QueryCommandInput, PutItemCommand, PutItemCommandInput, QueryCommand, AttributeValue } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

export interface SongLogFacade {
    most_recent_play_timestamp() : Promise<string>;
    log_song_play(song: SpotifyApi.PlayHistoryObject) : Promise<void>;
}

export class DynamoSongLogFacade implements SongLogFacade {
    private client: DynamoDBClient;
    private table_name: string;
    private user_id: string;

    constructor (table_name: string, user_id: string) {
        this.client = new DynamoDBClient({});
        this.user_id = user_id;
        this.table_name = table_name;
    }

    async log_song_play(song: SpotifyApi.PlayHistoryObject): Promise<void> {
        const input: PutItemCommandInput = {
            TableName: this.table_name,
            Item: marshall({
                'user_id' : this.user_id,
                'time_played_utc' : song.played_at,
                'song_name': song.track.name,
                'song_id': song.track.id
              })
        };
        await this.client.send(new PutItemCommand(input));
    }

    async most_recent_play_timestamp(): Promise<string> {
        const input: QueryCommandInput = {
            TableName: this.table_name,
            Limit: 1,
            KeyConditionExpression: 'user_id = :u',
            ExpressionAttributeValues: {
                ":u": {
                    S: this.user_id
                }
            },
            ScanIndexForward: false //This tells the query to return the latest key first
        }
        let response = await this.client.send(new QueryCommand(input));
        return new Promise<string>((resolve) => {
            resolve(response.Items[0]["time_played_utc"].S);
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