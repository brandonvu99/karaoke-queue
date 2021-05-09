from flask import Flask, request, jsonify
import uuid
from datetime import datetime, timedelta
from flask_cors import CORS, cross_origin

from ..types.Song import Song
from ..services import spotify_service

flask_app = Flask(__name__)

@flask_app.route("/", methods=['GET'])
def get_initial_response():
    """Welcome message for the API."""
    # Message to the user
    message = {
        'apiVersion': 'v1.0',
        'status': '200',
        'message': 'Welcome to the Flask API'
    }
    # Making the message looks good
    resp = jsonify(message)
    # Returning the object
    return resp

@flask_app.route("/api/song_queues/<song_queue_id>/songs", methods=['POST'])
def create_song(song_queue_id):
    jsonData = request.json

    requester_id = jsonData['requester_id']
    artist = jsonData['artist']
    song_name = jsonData['song_name']
    print("HI")

    try:
        date_created = datetime.strptime(jsonData['date_created'], r'%Y-%m-%dT%H:%M:%S.%f%z')
    except ValueError:
        return f'Supplied date_created of ({jsonData["date_created"]}) does not match the strp format %Y-%m-%dT%H:%M:%S.%f%z. A correct example is 2021-05-04T20:36:41.994702+0000', 400

    print("HI1")
    try:
        artist, song_name, image_url, duration_ms = spotify_service.get_artist_song_name_image_url_duration(artist, song_name)
    except ValueError as e:
        return "Could not get spotify details" + str(e), 400
    # duration_seconds = timedelta(microseconds=duration_ms*1000).seconds
    # hours, remainder = divmod(duration_seconds, 3600)
    # minutes, seconds = divmod(remainder, 60)
    # duration_str = '{:02}:{:02}'.format(int(minutes), int(seconds))
    print("HI2")
    song_to_write = Song(
        song_queue_id=song_queue_id,
        id=str(uuid.uuid4()), 
        requester_id=requester_id, 
        date_created=date_created, 
        artist=artist,
        song_name=song_name,
        duration_ms=duration_ms,
        upvotes=[requester_id],
        image_url=image_url
    )
    song_to_write.save()
    print("HI3")
    return song_to_dict(song_to_write), 200

@flask_app.route("/api/song_queues/<song_queue_id>/songs", methods=['GET'])
def get_songs(song_queue_id):
    retStrings = []
    for item in Song.query(song_queue_id):
        retStrings.append(song_to_dict(item))
    return jsonify(sorted(retStrings, key=lambda item: (-len(item['upvotes']), item['date_created']))), 200

@flask_app.route("/api/song_queues/<song_queue_id>/songs/<id>", methods=['DELETE'])
def delete_song(song_queue_id, id):
    song_to_delete = Song.get(
        song_queue_id,
        id
    )
    song_to_delete.delete()
    return song_to_dict(song_to_delete), 200

@flask_app.route("/api/song_queues/<song_queue_id>/songs/<id>/upvote", methods=['POST'])
def update_upvote(song_queue_id, id):
    jsonData = request.json

    requester_id = jsonData['requester_id']
    is_upvote = jsonData['is_upvote']

    song_to_update = Song.get(
        song_queue_id,
        id
    )
    if is_upvote:
        updated_song_info = song_to_update.update(
            actions=[
                Song.upvotes.add({requester_id})
            ]
        )
    else:
        updated_song_info = song_to_update.update(
            actions=[
                Song.upvotes.delete({requester_id})
            ]
        )
    updated_song_info = updated_song_info['Attributes']

    update_song = Song(
        song_queue_id=updated_song_info['song_queue_id']['S'],
        id=updated_song_info['id']['S'], 
        requester_id=updated_song_info['requester_id']['S'], 
        date_created=datetime.strptime(updated_song_info['date_created']['S'], r'%Y-%m-%dT%H:%M:%S.%f%z'), 
        artist=updated_song_info['artist']['S'],
        song_name=updated_song_info['song_name']['S'],
        duration_ms=int(updated_song_info['duration_ms']['N']),
        upvotes=(list() if 'upvotes' not in updated_song_info else updated_song_info['upvotes']['SS']),
        image_url=updated_song_info['image_url']['S']
    )
    return song_to_dict(update_song), 200

def song_to_dict(song):
    song_dict = dict(song)
    if song_dict['upvotes'] is None:
        song_dict['upvotes'] = list()
    else:
        song_dict['upvotes'].sort()
    return song_dict

Song.create_table(wait=True)

def create_song_manual(requester_id, artist, song_name, date_created, upvotes):
    try:
        artist, song_name, image_url, duration_ms = spotify_service.get_artist_song_name_image_url_duration(artist, song_name)
    except ValueError as e:
        return str(e), 400

    song_to_write = Song(
        song_queue_id="1",
        id=str(uuid.uuid4()), 
        requester_id=requester_id, 
        date_created=date_created, 
        artist=artist,
        song_name=song_name,
        duration_ms=duration_ms,
        upvotes=upvotes,
        image_url=image_url
    )
    song_to_write.save()
    return song_to_dict(song_to_write), 200

if Song.count() == 0:
    import random
    random.seed(0x022499)
    for song in [[
                    "Lady Gaga",
                    "Bad Romance",
                    datetime.now() - timedelta(days=1, hours=1, minutes=0),
                    4
                ],
                [
                    "Paramore",
                    "Still Into You",
                    datetime.now() - timedelta(days=0, hours=3, minutes=0),
                    4
                ],
                [
                    "Lady Gaga",
                    "Judas",
                    datetime.now() - timedelta(days=0, hours=1, minutes=0),
                    4
                ],
                [
                    "gym class heroes",
                    "ass back home",
                    datetime.now() - timedelta(days=0, hours=2, minutes=0),
                    3
                ],
                [
                    "Taylor Swift",
                    "love story",
                    datetime.now() - timedelta(days=0, hours=1, minutes=0),
                    2
                ],
                [
                    "Katy Perry",
                    "Dark Horse",
                    datetime.now() - timedelta(days=0, hours=1, minutes=0),
                    1
                ],]:
        requesters = ["BrandonBackend", "BrandonAngularWindowsChrome", "BrandonAngulariOSSafari"]
        fake_upvoters = ["APython", "Python1", "Python2", "Python3", "ZPython"]
        create_song_manual(
            random.sample(requesters, 1)[0],
            *song[0:3], 
            random.sample(fake_upvoters, song[3])
        )

CORS(flask_app)