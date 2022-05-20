# Spotify Playlist Generator
Two AWS Lambda Functions that will work in tandem to generate Spotify Playlists based on recently listened to music.

## Major Pieces of Code

### /src/recent_song_logger_index.ts 
* Provides the Handler function for the Data Retrieval Lambda.
* Grabs recently played songs and saves them to a DynamoDB
* The DynamoDB will allow me to get around the 50 recent song query limit built into the Spotify API long term.
* Triggered every 20 minutes by a Cloudwatch Trigger

### /src/recent_songs_playlist_creator_index.ts
* Provides the Handler function for the Playlist Creation Lambda.
* Grabs the recently played songs, dedupes them, and saves them to a playlist.
* Not currently triggered automatically, though it can run in the cloud via a manual trigger.
* It currently points to Spotifies API to get the recent songs, and needs to be updated to point to the DynamoDB.

### /infrastructure
* Contains Terraform defining the following infrastructure pieces in AWS
	* The Data Retrieval Lambda
	* The Playlist Creation Lambda
	* The Song Long DynamoDB
		* Hash key of user_id
		* Range key of time_played_utc
	* Various IAM Policies and Roles
	* Currently there are no Code Pipelines, though that would be a valuable long term add.

## Running Locally

### config.json

To run locally, you will need to add a config.json file with the following schema in the local_runner folder

    {   
		"client_id": "",
		"client_secret": ""   
		"refresh_token": ""
    }

You can get a client id and secret by creating an app here: https://developer.spotify.com/dashboard/applications

You can get a refresh token by following the OAuth2 flow against Spotify using Postman: https://blog.postman.com/generate-spotify-playlists-using-a-postman-collection/
* A slight modification to this tutorial is that you will need a token with the following scopes:
	* playlist-read-private 
	* playlist-modify-private 
	* user-read-recently-played 
	* user-top-read
	
### local_runner
There is an included local_runner app that imports a Lambda handler defined in the src folder and runs it locally.

## Disclaimer
This project is my first real experience with JS and Typescript, and I acknowledge that there are better ways to handle pieces of it, especially in terms of package management.

## Sources
https://developer.spotify.com/documentation/web-api/quick-start/
https://blog.postman.com/generate-spotify-playlists-using-a-postman-collection/
https://github.com/thelinmichael/spotify-web-api-node

## Other Resources
https://medium.com/coinmonks/everything-you-wanted-to-know-about-package-lock-json-b81911aa8ab8
