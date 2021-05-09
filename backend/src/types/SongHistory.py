from src.types.Song import BaseSong, setup_model

from src.services import config_service

try:
    dynamodb_host = config_service.configuration['aws']['dynamodb']['host-url']
except KeyError:
    dynamodb_host = None

try:
    aws_access_key_id = config_service.configuration['aws']['access-key-id']
except KeyError:
    aws_access_key_id = None

try:
    aws_secret_access_key = config_service.configuration['aws']['secret-access-key']
except KeyError:
    aws_secret_access_key = None

SongHistory = setup_model(
    BaseSong,
    "songs-history",
    dynamodb_host,
    aws_access_key_id,
    aws_secret_access_key
)