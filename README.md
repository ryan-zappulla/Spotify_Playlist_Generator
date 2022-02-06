# Spotify Playlist Generator
An AWS Lambda Function that will retrieve a users recently listened to music, grab a random handful of their songs, and turn them into a playlist. This will be triggered daily by a Cloudwatch event.

## Running Locally

### config.json

To run locally, you will need to add a config.json file with the following schema in the src folder

    {   
	    "access_token" : "",   
	    "refresh_token": ""
    }

You can get an access and refresh token by following the OAuth2 flow against Spotify using Postman: https://blog.postman.com/generate-spotify-playlists-using-a-postman-collection/
* A slight modification to this tutorial is that you will need a token with the following scopes:
	* playlist-read-private 
	* playlist-modify-private 
	* user-read-recently-played 
	* user-top-read
### local_runner
There is an included local_runner app that imports the Lambda handler defined in the src folder and runs it locally. Long term, it will also be used to pass configuration into the main app.

## Sources
https://developer.spotify.com/documentation/web-api/quick-start/
https://blog.postman.com/generate-spotify-playlists-using-a-postman-collection/
https://github.com/thelinmichael/spotify-web-api-node