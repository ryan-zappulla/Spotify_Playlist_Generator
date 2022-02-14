data "aws_iam_policy_document" "trust_policy" {
  statement {
    actions    = ["sts:AssumeRole"]
    effect     = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda" {
  name               = var.playlist_creator_lambda_name
  assume_role_policy = "${data.aws_iam_policy_document.trust_policy.json}"
}

resource "aws_iam_role_policy_attachment" "lambda_basic_policy" {
  role       = "${aws_iam_role.lambda.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"//TODO: Replace this with a more precise role
}

resource "aws_lambda_function" "lambda" {
  filename          = "src.zip"
  function_name     = var.playlist_creator_lambda_name
  role              = aws_iam_role.lambda.arn
  handler           = "index.handler"
  source_code_hash  = filebase64sha256("src.zip")//TODO: Get a Code Pipeline in place
  runtime           = "nodejs12.x"
  memory_size       = 128
  timeout           = 60  
}