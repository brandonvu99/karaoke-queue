from flask import Flask, request, jsonify
import json
import uuid
from datetime import datetime, timedelta

from Song import Song
import service_spotify

app = Flask(__name__)
app.config["DEBUG"] = True

@app.route("/", methods=['GET'])
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

@app.route("/api/songs_queues/<song_queue_id>/songs", methods=['POST'])
def create_song(song_queue_id):
    jsonData = request.json

    user_id = jsonData['user_id']
    artist = jsonData['artist']
    song_name = jsonData['song_name']

    try:
        date_created = datetime.strptime(jsonData['date_created'], r'%Y-%m-%dT%H:%M:%S.%f%z')
    except ValueError:
        return f'Supplied date_created of ({jsonData["date_created"]}) does not match the strp format %Y-%m-%dT%H:%M:%S.%f%z. A correct example is 2021-05-04T20:36:41.994702+0000', 400

    try:
        artist, song_name, image_url, duration_ms = service_spotify.get_artist_song_name_image_url_duration(artist, song_name)
    except ValueError as e:
        return str(e), 400
    duration_seconds = timedelta(microseconds=duration_ms*1000).seconds
    hours, remainder = divmod(duration_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    duration_str = '{:02}:{:02}'.format(int(minutes), int(seconds))

    song_to_write = Song(
        song_queue_id=song_queue_id,
        id=str(uuid.uuid4()), 
        user_id=user_id, 
        date_created=date_created, 
        artist=artist,
        song_name=song_name,
        image_url=image_url,
        duration=duration_str
    )
    song_to_write.save()
    return dict(song_to_write), 200

@app.route("/api/songs_queues/<song_queue_id>/songs", methods=['GET'])
def get_songs(song_queue_id):
    retStrings = []
    for item in Song.query(song_queue_id):
        retStrings.append(dict(item))
    return jsonify(sorted(retStrings, key=lambda item: item['date_created'])), 200

@app.route("/api/songs_queues/<song_queue_id>/songs/<id>", methods=['DELETE'])
def delete_song(song_queue_id, id):
    song_to_delete = Song(
        song_queue_id=song_queue_id,
        id=id
    )
    deleted_song = song_to_delete.delete()
    return str(deleted_song), 200

@app.route("/api/songs_queues/<song_queue_id>/songs/<id>/upvote/<update_vote_by_this_much>", methods=['POST'])
def update_upvote_on_song_by(song_queue_id, id, update_upvote_by_this_much):
    update_upvote_by_this_much = int(update_upvote_by_this_much)
    if abs(update_upvote_by_this_much) != 1:
        return f'update_vote_by_this_much must be -1 or 1. Value was {update_upvote_by_this_much}', 400
    song_to_update = Song.get(
        song_queue_id,
        id
    )
    updated_song = song_to_update.update(
        actions=[
            Song.upvotes.set(Song.upvotes + update_upvote_by_this_much)
        ]
    )
    return dict(updated_song), 200

Song.create_table(wait=True)
app.run()