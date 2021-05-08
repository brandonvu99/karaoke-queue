
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

from . import config_service

client_id = config_service.configuration['spotify']['client-id']
client_secret = config_service.configuration['spotify']['client-secret']

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=client_id, client_secret=client_secret))

def search(artist, song_name):
    return sp.search(f'{artist} {song_name}', limit=5, offset=0, type='track', market='US')

def get_artist_song_name_image_url_duration(artist, song_name):
    songs = search(artist, song_name)['tracks']['items']
    if len(songs) == 0:
        raise ValueError("artist and song_name did not get any results back")
    song_info = songs[0]
    artist = song_info['album']['artists'][0]['name']
    song_name = song_info['name']
    image_url = song_info['album']['images'][-2]['url']
    duration = song_info['duration_ms']
    return artist, song_name, image_url, duration