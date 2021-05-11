from src.types.Song import Song
import uuid
from datetime import datetime, timedelta
import random
import pprint

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

def sort_key_by_upvotes_descending_then_by_date_created_ascending(item):
    return (-len(item['upvotes']), item['date_created'])
print("\nsort_key_by_upvotes_descending_then_by_date_created_ascending:")
pprint.pprint(sorted(all_songs, key=lambda item: sort_key_by_upvotes_descending_then_by_date_created_ascending(item)))

from collections import defaultdict
def iwrr(bucket_identifer_to_requested_songs_mapping):
    scheduled_songs = []
    weights = []
    queues = []
    for requester, songs in bucket_identifer_to_requested_songs_mapping.items():
        upvotes = sum([len(song['upvotes']) for song in songs])
        weights.append(upvotes)
        queues.append(songs)
    w_max = max(weights)
    for round in range(w_max):
        for i in range(len(bucket_identifer_to_requested_songs_mapping)):
            if (len(queues[i]) != 0) and (weights[i] >= round):
                scheduled_songs.append(queues[i][0])
                del queues[i][0]
    return scheduled_songs
    
def weighted_round_robin_with_queues_on_requester_id(song_list):
    requester_to_requested_songs_mapping = defaultdict(lambda: list())
    for song in song_list:
        requester_to_requested_songs_mapping[song['requester_id']].append(song)
    return iwrr(requester_to_requested_songs_mapping)

print("\nweighted_round_robin_with_queues_on_requester_id")
pprint.pprint(weighted_round_robin_with_queues_on_requester_id(all_songs))

def weighted_round_robin_with_queues_on_upvotes(song_list):
    num_upvotes_to_requested_songs_mapping = defaultdict(lambda: list())
    for song in song_list:
        num_upvotes_to_requested_songs_mapping[len(song['upvotes'])].append(song)
    return iwrr(num_upvotes_to_requested_songs_mapping)

print("\nweighted_round_robin_with_queues_on_upvotes")
pprint.pprint(weighted_round_robin_with_queues_on_upvotes(all_songs))




