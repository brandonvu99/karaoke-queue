from pynamodb.models import Model
from pynamodb.attributes import MapAttribute, NumberAttribute, UnicodeAttribute, UnicodeSetAttribute, UTCDateTimeAttribute

from src.services import config_service
from src.types import Song

class SongHistory(Model):
    class Meta:
        table_name = "songs-history"
        host = config_service.configuration['aws']['dynamodb']['host-url']
        aws_access_key_id = config_service.configuration['aws']['access-key-id']
        aws_secret_access_key = config_service.configuration['aws']['secret-access-key']
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
                (o.__class__ == Song) and \
                (o.id == self.id))
    
    def __iter__(self):
        for name, attr in self.get_attributes().items():
            if isinstance(attr, MapAttribute):
                yield name, getattr(self, name).as_dict()
            else:
                yield name, attr.serialize(getattr(self, name))