from pynamodb.attributes import MapAttribute, NumberAttribute, UnicodeAttribute, UnicodeSetAttribute, UTCDateTimeAttribute
from pynamodb.models import Model
from pynamodb.settings import default_settings_dict

from src.services import config_service
from src.types.utils import setup_model

class SongHistoryWithoutConfiguration(Model):
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
                (o.__class__ == SongHistoryWithoutConfiguration) and \
                (o.id == self.id))
    
    def __iter__(self):
        for name, attr in self.get_attributes().items():
            if isinstance(attr, MapAttribute):
                yield name, getattr(self, name).as_dict()
            else:
                yield name, attr.serialize(getattr(self, name))

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
    SongHistoryWithoutConfiguration,
    "songs-history",
    dynamodb_host,
    aws_access_key_id,
    aws_secret_access_key
)