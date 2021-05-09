from pynamodb.models import Model
from pynamodb.attributes import MapAttribute, NumberAttribute, UnicodeAttribute, UnicodeSetAttribute, UTCDateTimeAttribute
from pynamodb.settings import default_settings_dict
from typing import Type

from src.services import config_service

class BaseSong(Model):
    class Meta:
        write_capacity_units = 5
        read_capacity_units = 5

    # Partition Key, tells us which Song_Queue this Song belongs to
    song_queue_id = UnicodeAttribute(hash_key=True)

    # Sort Key, id that uniquely identifies a Song
    id = UnicodeAttribute(range_key=True)

    # ID of the requestor of the Song
    requester_id = UnicodeAttribute()

    # Time of Song request in epoch milliseconds
    date_created = UTCDateTimeAttribute()

    # Song Artist name
    artist = UnicodeAttribute()

    # Song name
    song_name = UnicodeAttribute()

    # Song duration
    duration_ms = NumberAttribute(default=0) # UnicodeAttribute(default="03:15")

    # A set of requester_id's that have upvoted this song
    upvotes = UnicodeSetAttribute(default=dict)

    # Song image url
    image_url = UnicodeAttribute()

    def __eq__(self, o: object) -> bool:
        if self is o:
            return True
        return ((o is not None) and \
                (o.__class__ == BaseSong) and \
                (o.id == self.id))
    
    def __iter__(self):
        for name, attr in self.get_attributes().items():
            if isinstance(attr, MapAttribute):
                yield name, getattr(self, name).as_dict()
            else:
                yield name, attr.serialize(getattr(self, name))

# Solution found from: https://github.com/pynamodb/PynamoDB/issues/287
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

Song = setup_model(
    BaseSong,
    "songs",
    dynamodb_host,
    aws_access_key_id,
    aws_secret_access_key
)