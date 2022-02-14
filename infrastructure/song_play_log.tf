resource "aws_dynamodb_table" "dynamo" {
    name            = var.song_play_log_dynamo_name
    hash_key        = "user_id"
    range_key       = "time_played_utc"
    billing_mode    = "PAY_PER_REQUEST"

    attribute {
        name = "user_id"
        type = "S"
    }

    attribute {
        name = "time_played_utc"
        type = "S"
    }
}