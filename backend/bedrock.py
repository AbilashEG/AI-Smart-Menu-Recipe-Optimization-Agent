import boto3
import json
import os
from dotenv import load_dotenv

# Load credentials from .env relative to this script
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION')
BEDROCK_MODEL_ID = os.getenv('BEDROCK_MODEL_ID')

# Bedrock Runtime client
bedrock_runtime = boto3.client(
    'bedrock-runtime',
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)


def invoke_nova_pro(prompt_text):
    """
    Send prompt to Amazon Bedrock Nova Pro and return the text response.
    Uses the Nova Pro converse-style request body format.
    """
    try:
        # Nova Pro request body
        request_body = {
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"text": prompt_text}
                    ]
                }
            ],
            "inferenceConfig": {
                "max_new_tokens": 1500,
                "temperature": 0.3,
                "top_p": 0.9
            }
        }

        # Call Bedrock invoke_model
        response = bedrock_runtime.invoke_model(
            modelId=BEDROCK_MODEL_ID,
            contentType='application/json',
            accept='application/json',
            body=json.dumps(request_body)
        )

        # Parse response
        response_body = json.loads(response['body'].read())

        # Extract text from Nova Pro response structure
        output_text = response_body['output']['message']['content'][0]['text']

        # Print token usage for debugging
        usage = response_body.get('usage', {})
        print(f"[bedrock] Tokens — input: {usage.get('inputTokens', 'N/A')}, "
              f"output: {usage.get('outputTokens', 'N/A')}")

        return output_text

    except Exception as e:
        print(f"[bedrock] Error invoking Nova Pro: {e}")
        raise
