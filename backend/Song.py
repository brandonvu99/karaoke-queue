from pynamodb.models import Model
from pynamodb.attributes import MapAttribute, NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute

from config import DYNAMODB_URL, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY

class Song(Model):
    class Meta:
        table_name = "songs"
        host = DYNAMODB_URL
        aws_access_key_id = AWS_ACCESS_KEY_ID
        aws_secret_access_key = AWS_SECRET_ACCESS_KEY
        write_capacity_units = 10
        read_capacity_units = 10

    # Partition Key, tells us which Song_Queue this Song belongs to
    song_queue_id = UnicodeAttribute(hash_key=True)

    # Sort Key, id that uniquely identifies a Song
    id = UnicodeAttribute(range_key=True)

    # ID of the requestor of the Song
    user_id = UnicodeAttribute()

    # Time of Song request in epoch milliseconds
    date_created = UTCDateTimeAttribute()

    # Song Artist name
    artist = UnicodeAttribute()

    # Song name
    song_name = UnicodeAttribute()

    # Song duration
    duration_ms = NumberAttribute(default=0) # UnicodeAttribute(default="03:15")

    # Number of upvotes on this song
    upvotes = NumberAttribute(default=0)

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