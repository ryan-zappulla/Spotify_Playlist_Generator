data "aws_iam_policy_document" "song_logger_trust_policy" {
  statement {
    actions    = ["sts:AssumeRole"]
    effect     = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "song_logger_lambda" {
  name               = var.recent_song_logger_lambda_name
  assume_role_policy = "${data.aws_iam_policy_document.song_logger_trust_policy.json}"
  inline_policy {
    name        = var.recent_song_logger_lambda_name
    policy      = data.aws_iam_policy_document.song_logger_lambda_permissions.json
  }
}

data "aws_iam_policy_document" "song_logger_lambda_permissions" {
  statement {
    actions   = [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
              ]
    resources = ["*"]
  }
  statement {
    actions = [ "dynamodb:PutItem" ]
    resources = [aws_dynamodb_table.song_log.arn]
  }
}

resource "aws_lambda_function" "song_logger_lambda" {
  filename          = "src.zip"//TODO: Get a Code Pipeline in place
  function_name     = var.recent_song_logger_lambda_name
  role              = aws_iam_role.song_logger_lambda.arn
  handler           = "compiled/recent_song_logger_index.lambda_handler"
  source_code_hash  = filebase64sha256("src.zip")
  runtime           = "nodejs12.x"
  memory_size       = 128
  timeout           = 60
  environment {
    variables = {
      client_id = var.spotify_client_id
      client_secret = var.spotify_client_secret
      refresh_token = var.spotify_refresh_token
    }
  }
}