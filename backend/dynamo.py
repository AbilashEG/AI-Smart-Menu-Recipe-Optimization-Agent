import boto3
import os
from dotenv import load_dotenv
from decimal import Decimal

# Load credentials from .env relative to this script
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION')

MENU_TABLE = os.getenv('DYNAMODB_MENU_TABLE')
ORDERS_TABLE = os.getenv('DYNAMODB_ORDERS_TABLE')
REVIEWS_TABLE = os.getenv('DYNAMODB_REVIEWS_TABLE')

# Single DynamoDB resource shared across all functions
dynamodb = boto3.resource(
    'dynamodb',
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)


def _decimal_to_native(obj):
    """Convert DynamoDB Decimal types to int/float for JSON serialization."""
    if isinstance(obj, list):
        return [_decimal_to_native(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: _decimal_to_native(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return int(obj) if obj == int(obj) else float(obj)
    return obj


def _scan_table(table_name):
    """Full scan with pagination — loops until all records are fetched."""
    table = dynamodb.Table(table_name)
    items = []
    response = table.scan()
    items.extend(response.get('Items', []))

    # DynamoDB returns max 1MB per scan; loop if more pages exist
    while 'LastEvaluatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        items.extend(response.get('Items', []))

    return _decimal_to_native(items)


def get_all_menu_items():
    """Scan restaurant_menu table and return all dish records."""
    try:
        items = _scan_table(MENU_TABLE)
        print(f"[dynamo] Fetched {len(items)} items from {MENU_TABLE}")
        return items
    except Exception as e:
        print(f"[dynamo] Error scanning {MENU_TABLE}: {e}")
        raise


def get_all_orders():
    """Scan restaurant_orders table and return all order records."""
    try:
        items = _scan_table(ORDERS_TABLE)
        print(f"[dynamo] Fetched {len(items)} items from {ORDERS_TABLE}")
        return items
    except Exception as e:
        print(f"[dynamo] Error scanning {ORDERS_TABLE}: {e}")
        raise


def get_all_reviews():
    """Scan restaurant_reviews table and return all review records."""
    try:
        items = _scan_table(REVIEWS_TABLE)
        print(f"[dynamo] Fetched {len(items)} items from {REVIEWS_TABLE}")
        return items
    except Exception as e:
        print(f"[dynamo] Error scanning {REVIEWS_TABLE}: {e}")
        raise
