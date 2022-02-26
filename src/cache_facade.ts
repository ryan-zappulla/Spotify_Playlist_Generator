export interface CacheFacade {
    most_recent_play_timestamp() : Promise<string>
}

export class DynamoCacheFacade implements CacheFacade {
    most_recent_play_timestamp(): Promise<string> {
        throw new Error("Method not implemented.");
    }
}

export class NoopDynamoCacheFacade implements CacheFacade {

    private timestamp: string;

    constructor (timestamp: string) {
        this.timestamp = timestamp;
    }

    most_recent_play_timestamp(): Promise<string> {
        return new Promise<string>((resolve) => {
            resolve(this.timestamp);
        });
    }
}