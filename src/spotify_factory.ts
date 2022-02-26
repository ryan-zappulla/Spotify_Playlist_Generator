import SpotifyWebApi = require("spotify-web-api-node");
const config = require('./config.json');

export async function create_spotify(client_id: string, client_secret: string, refresh_token: string): Promise<SpotifyWebApi> {
    let spotify = new SpotifyWebApi();
    spotify.setRefreshToken(refresh_token);
    spotify.setClientId(client_id);
    spotify.setClientSecret(client_secret);
    let refreshResponse = await spotify.refreshAccessToken();
    await spotify.setAccessToken(refreshResponse.body.access_token);
    return spotify;
}
