import { Song } from "../../domain/song";


export interface Recent_Song_Provider {
    get_recently_played_songs(count?: number): Promise<Song[]>;
    name: string;
}
