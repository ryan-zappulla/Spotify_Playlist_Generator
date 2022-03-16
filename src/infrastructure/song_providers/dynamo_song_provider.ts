import { GetItemCommandInput, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb/dist-types/DynamoDBClient";
import { Song } from "../../domain/song";
import { Recent_Song_Provider } from "./recent_song_provider";

export class Dynamo_Song_Provider implements Recent_Song_Provider {
    readonly name: string;
    client: DynamoDBClient;
    table_name: string;
    user_id: string;
    
    constructor(table_name: string, user_id: string) {
        //This feels weird. It could be worth adding an "Source" layer of abstraction
        //to prevent it from being needed for this object while still allowing it for the spotify stuff.
        this.client = new DynamoDBClient({});
        this.name = "dynamo"
        this.table_name = table_name;
        this.user_id = user_id;
    }
    
    get_recently_played_songs(count?: number): Promise<Song[]> {
        const defaultCount = 100;
        if(count == undefined)
        {
            count = defaultCount;
        }

        const input: QueryCommandInput = {
            TableName: this.table_name,
            ScanIndexForward: false,
            Limit: count,
            KeyConditionExpression: "user_id = :u",
            ExpressionAttributeValues: {
                ":u": {
                    S: this.user_id
                }
            },
        };
        throw new Error("Method not implemented.");
    }
}