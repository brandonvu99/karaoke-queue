from flask import Flask, request, jsonify
import json
import uuid
from datetime import datetime, timedelta
from flask_cors import CORS, cross_origin

from Song import Song
import service_spotify

app = Flask(__name__)

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

@app.route("/api/song_queues/<song_queue_id>/songs", methods=['POST'])
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
    # duration_seconds = timedelta(microseconds=duration_ms*1000).seconds
    # hours, remainder = divmod(duration_seconds, 3600)
    # minutes, seconds = divmod(remainder, 60)
    # duration_str = '{:02}:{:02}'.format(int(minutes), int(seconds))

    song_to_write = Song(
        song_queue_id=song_queue_id,
        id=str(uuid.uuid4()), 
        user_id=user_id, 
        date_created=date_created, 
        artist=artist,
        song_name=song_name,
        duration_ms=duration_ms,
        image_url=image_url
    )
    song_to_write.save()
    return song_to_dict(song_to_write), 200

@app.route("/api/song_queues/<song_queue_id>/songs", methods=['GET'])
def get_songs(song_queue_id):
    retStrings = []
    for item in Song.query(song_queue_id):
        retStrings.append(song_to_dict(item))
    return jsonify(sorted(retStrings, key=lambda item: item['date_created'])), 200

@app.route("/api/song_queues/<song_queue_id>/songs/<id>", methods=['DELETE'])
def delete_song(song_queue_id, id):
    song_to_delete = Song.get(
        song_queue_id,
        id
    )
    song_to_delete.delete()
    return song_to_dict(song_to_delete), 200

@app.route("/api/song_queues/<song_queue_id>/songs/<id>/upvote", methods=['POST'])
def update_upvote(song_queue_id, id):
    jsonData = request.json

    user_id = jsonData['user_id']
    is_upvote = jsonData['is_upvote']

    song_to_update = Song.get(
        song_queue_id,
        id
    )
    if is_upvote:
        updated_song_info = song_to_update.update(
            actions=[
                Song.upvotes.add({user_id})
            ]
        )
    else:
        updated_song_info = song_to_update.update(
            actions=[
                Song.upvotes.delete({user_id})
            ]
        )
    updated_song_info = updated_song_info['Attributes']
    print(updated_song_info)

    update_song = Song(
        song_queue_id=updated_song_info['song_queue_id']['S'],
        id=updated_song_info['id']['S'], 
        user_id=updated_song_info['user_id']['S'], 
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
    return song_dict

Song.create_table(wait=True)
CORS(app)
app.run(debug=True)