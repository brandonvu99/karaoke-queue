from pynamodb.models import Model
from pynamodb.attributes import MapAttribute, NumberAttribute, UnicodeAttribute, UnicodeSetAttribute, UTCDateTimeAttribute
from pynamodb.settings import default_settings_dict
from typing import Type

from src.services import config_service
from src.types.BaseSong import BaseSong

class Song(BaseSong):
    class Meta:
        table_name = "songs"
        aws_access_key_id = "AKIATNJBQMGJEKFIOLU3"
        aws_secret_access_key = "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"

# # Solution found from: https://github.com/pynamodb/PynamoDB/issues/287
# def setup_model(model_class: Type[Model],
#                 table_name: str,
#                 host: str = '',
#                 aws_access_key_id: str = '',
#                 aws_secret_access_key:str = '') -> Type[Model]:
#     if not issubclass(model_class, Model):
#         raise TypeError('Model class must be a subclass of Model')
    
#     meta_class = getattr(model_class, 'Meta')

#     setattr(meta_class, 'table_name', table_name)

#     if bool(host):
#         setattr(meta_class, 'host', host)

#     if bool(aws_access_key_id):
#         setattr(meta_class, 'aws_access_key_id', aws_access_key_id)
#     else:
#         setattr(meta_class, 'aws_access_key_id', 'fake')

#     if bool(aws_secret_access_key):
#         setattr(meta_class, 'aws_secret_access_key', aws_secret_access_key)
#     else:
#         setattr(meta_class, 'aws_secret_access_key', 'anything')

#     return model_class

# try:
#     dynamodb_host = config_service.configuration['aws']['dynamodb']['host-url']
# except KeyError:
#     dynamodb_host = None

# try:
#     aws_access_key_id = config_service.configuration['aws']['access-key-id']
# except KeyError:
#     aws_access_key_id = None

# try:
#     aws_secret_access_key = config_service.configuration['aws']['secret-access-key']
# except KeyError:
#     aws_secret_access_key = None

# Song = setup_model(
#     BaseSong,
#     "songs",
#     dynamodb_host,
#     aws_access_key_id,
#     aws_secret_access_key
# )