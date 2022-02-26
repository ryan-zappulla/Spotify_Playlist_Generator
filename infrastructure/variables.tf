variable "region" {
  type        = string
  description = "Region to deploy to"
}

variable "playlist_creator_lambda_name" {
  type        = string
  description = "Name of the Lambda function used to create playlists"
}

variable "song_play_log_dynamo_name" {
  type        = string
  description = "Name of the Dynamo used to store recently played songs"
}

variable "spotify_client_id" {
  type        = string
  description = "Client ID for the associated Spotify App"
}

variable "spotify_client_secret" {
  type        = string
  description = "Client Secret for the associated Spotify App"
}

#This should be replaced with an Auth Flow implimentation
variable "spotify_refresh_token" {
  type        = string
  description = "Refresh Token for the associated Spotify User"
}