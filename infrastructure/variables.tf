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