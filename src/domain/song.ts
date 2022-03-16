
export class Song {
    id: string;
    played_timestamp_utc: string;
    name: string;

    constructor(id: string, played_timestamp_utc: string, name: string) {
        this.id = id;
        this.played_timestamp_utc = played_timestamp_utc;
        this.name = name;
    }
}
