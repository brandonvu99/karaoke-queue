from typing import Type

from pynamodb.models import Model

# Solution found from: https://github.com/pynamodb/PynamoDB/issues/287
# Args:
#   host: dynamodb host name, should be only used when doing local development and dynamo is in a docker container
#   aws_access_key_id: aws access key id, only needed for cloud connection
#   aws_secret_access_key: aws secret access key, only needed for cloud connection
def setup_model(model_class: Type[Model],
                table_name: str,
                host: str = '',
                aws_access_key_id: str = '',
                aws_secret_access_key:str = '') -> Type[Model]:
    if not issubclass(model_class, Model):
        raise TypeError('Model class must be a subclass of Model')
    
    meta_class = getattr(model_class, 'Meta')

    setattr(meta_class, 'table_name', table_name)

    if bool(host):
        setattr(meta_class, 'host', host)

    if bool(aws_access_key_id):
        setattr(meta_class, 'aws_access_key_id', aws_access_key_id)
    else:
        setattr(meta_class, 'aws_access_key_id', 'fake')

    if bool(aws_secret_access_key):
        setattr(meta_class, 'aws_secret_access_key', aws_secret_access_key)
    else:
        setattr(meta_class, 'aws_secret_access_key', 'anything')

    return model_class