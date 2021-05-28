from src.types.Song import Song
import uuid
from datetime import datetime, timedelta
import random
import pprint

random.seed(0xDEADBEEF)

mock_data_start_time = datetime(year=2021, month=5, day=5, hour=12, minute=0, second=0)
def t(hours, minutes, seconds):
    return time_after_mock_start(hours, minutes, seconds)
def time_after_mock_start(hours, minutes, seconds):
    return mock_data_start_time + timedelta(hours=hours, minutes=minutes, seconds=seconds)

brandon_name_and_songs = ["Brandon", [
    [
        t(0, 0, 0),
        "Lady Gaga",
        "Bad Romance",
        6
    ],
    [
        t(0, 0, 30),
        "Dua Lipa",
        "Levitating",
        6
    ],
    [
        t(0, 0, 0),
        "Dua Lipa",
        "Don't Start Now",
        4
    ],
    [
        t(0, 0, 59),
        "New Romantics",
        "Taylor Swift",
        3
    ],
    [
        t(0, 1, 30),
        "CHEMISTRY",
        "Period",
        1
    ]
]]

shermel_name_and_songs = ["Shermel", [
    [
        t(0, 0, 1),
        "Gym Class Heroes",
        "Ass Back Home",
        3
    ],
    [
        t(0, 0, 1),
        "Demi Lovato",
        "Here We Go Again",
        2
    ],
]]

justin_name_and_songs = ["Justin", [
    [
        t(0, 0, 15),
        "The Fray",
        "How To Save a Life",
        5
    ],
    [
        t(0, 0, 30),
        "The OffSpring",
        "You're Gonna Go Far, Kid",
        2
    ],
    [
        t(0, 0, 30),
        "Greenday",
        "Holiday",
        1
    ],
]]

all_songs = list()
for requester_name, songs_info in [brandon_name_and_songs, shermel_name_and_songs, justin_name_and_songs]:
    for date_created, artist, song_name, upvote_count in songs_info:
        all_songs.append(Song(
            song_queue_id="1", 
            id=str(uuid.uuid4()), 
            requester_id=requester_name, 
            date_created=date_created, 
            artist=artist, 
            song_name=song_name, 
            duration_ms=0, 
            upvotes=[str(random.randint(0, 100)) for _ in range(upvote_count)],
            image_url="fake url"
        ))
 
def sort_key_by_upvotes_descending_then_by_date_created_ascending(song_list):
    return sorted(all_songs, key=lambda item: (-len(item['upvotes']), item['date_created']))
print("\nsort_key_by_upvotes_descending_then_by_date_created_ascending:")
pprint.pprint(sort_key_by_upvotes_descending_then_by_date_created_ascending(all_songs))

from collections import defaultdict
# Input must be a dictionary whose keys are so called "bucket identifiers", which will be the differentiater for the queues.
# For example, supplying this dict:
#     {
#       6: [song_1, song_2, song_3],
#       3: [song_4, song_5, song_6],
#       1: [song_7]
#     }
# will do weighted-round-robin with the queues [song_1, song_2, song_3], [song_4, song_5, song_6], and [song_7].
# The weights for each queue currently is the total number of upvotes in that queue.
#
# The return will be a schedule of songs ordered by the interleaved weighted round robin algorithm.
def iwrr(bucket_identifer_to_requested_songs_mapping, pick_random_from_same_bucket=False):
    scheduled_songs = []
    weights = []
    queues = []
    for bucket_identifier, songs in bucket_identifer_to_requested_songs_mapping.items():
        upvotes = sum([len(song['upvotes']) for song in songs])
        weights.append(upvotes)
        queues.append(songs)
    w_max = max(weights)
    for round in range(w_max):
        for queue, weight in zip(queues, weights):
            if (len(queue) != 0) and (weight >= round):
                if pick_random_from_same_bucket:
                    rand_index_for_dequeue = random.randint(0, len(queue) - 1)
                    # Randomizing won't work because everyone will get a different ordering due to how the API works...
                    # The next line just makes either code branch do the same thing, which is dequeueing from the front of the queue.
                    rand_index_for_dequeue = 0
                    scheduled_songs.append(queue.pop(rand_index_for_dequeue))
                else:
                    scheduled_songs.append(queue.pop(0))
    return scheduled_songs

# Instinct tells me this is fair for everyone since it loops through each user
def weighted_round_robin_with_queues_on_requester_id(song_list):
    song_list = sort_key_by_upvotes_descending_then_by_date_created_ascending(song_list)
    requester_to_requested_songs_mapping = defaultdict(lambda: list())
    for song in song_list:
        requester_to_requested_songs_mapping[song['requester_id']].append(song)
    return iwrr(requester_to_requested_songs_mapping)

print("\nweighted_round_robin_with_queues_on_requester_id")
pprint.pprint(weighted_round_robin_with_queues_on_requester_id(all_songs))

# Instinct tellsme this is fair for the majority since the majority will be upvoting
def weighted_round_robin_with_queues_on_upvotes(song_list):
    song_list = sort_key_by_upvotes_descending_then_by_date_created_ascending(song_list)
    num_upvotes_to_requested_songs_mapping = defaultdict(lambda: list())
    for song in song_list:
        num_upvotes_to_requested_songs_mapping[len(song['upvotes'])].append(song)
    return iwrr(num_upvotes_to_requested_songs_mapping)

print("\nweighted_round_robin_with_queues_on_upvotes")
pprint.pprint(weighted_round_robin_with_queues_on_upvotes(all_songs))




