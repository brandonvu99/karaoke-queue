# Karaoke Queue App

This app creates a (priority) queue of songs, which are requested by users. There is a front-end created in Angular and a back-end created in Flask which communicates with DynamoDB.

# Front-End
The front-end has these capabilities:

- Allows users to set a username
- Allows users to submit a song
- Allows users to upvote songs
- Allows users to remove songs that only they themself requested
- Displays songs in a priority where the first song seen is the next (or currently playing) song

Songs will be refreshed every so often on the page through an API call to the back-end that will fetch ALL songs in the queue.

# Back-End: Flask API
The Flask api has these capabilities:

- Creating (a.k.a requesting) a song
    - On creation, the app will use Spotify's API to get a URL of the song's album cover and duration in milliseconds
- Getting all songs
- Deleting a song
- Upvoting and removing your upvote from a song

The code heavily uses pynamodb to orchestrate communication with DynamoDB.

# Back-End: DynamoDB
There is a table called `songs`, which has items uniquely identified by its hash key `song_queue_id` and its range key `id`. Below are descriptions of each attribute of an item in the table:
- `song_queue_id`: represents which song queue this song belongs to. It will be relevant in the future IF I decide to extend this app to have many karaoke queues run in parallel.
- `id`: just a unique identifier for a song in each song queue. Currently is a uuid4
- `requester_id`: id of the person who requested this song. Currently is supplied by the user in the webui but (in the future) can be a Google Social login id.
- `date_created`: time that this song was requested
- `artist`: artist of this song
- `song_name`: name of this song
- `duration_ms`: how long this song is in milliseconds
- `upvotes`: a set of `requester_id`s who have upvoted this song
- `image_url`: URL to the spotify image

There will also be a table called `history_of_songs` in the future that stores all requested songs EVER. This is purely for me being a data hoarder and wanting to see some data on how people are requesting songs (what artist/song_name combo are they using and if it's effective enough through if they deleted it quickly) and what songs work best for what group of karaokers (genre? artist? year released?)

# Setting Up Local Environment
1. Download the `amazonaws/dynamodb-local` docker image.
2. Start up a `amazonaws/dynamodb-local` container. Be sure to map the internal port to a port on your local machine.
3. cd into the backend directory.
    1. Fill out the `configs/example_config.yaml` file with your values:
        - `aws.dynamodb.host-url`: this is the url of your `amazonaws/dynamodb-local` docker container.
        - `aws.access-key-id` and `aws.secret-access-key`: can be anything for local development
        - `spotify.client-id` and `spotify.client-secret`: you will need to create a spotify app in their developer console to get these values.
4. cd into the frontend directory.
    1. Run `npm install`
    2. Change the value of `baseApiUrl` in `src/environments/environment.ts` to be `http://localhost:5000`. This value points to the backend's API URL, so if you change that, do change this value.
    3. Run `npm serve --host 0.0.0.0`
5. You should be able to load up the website at `http://localhost:4200`.

# Deployment Strategy
Currently, all these services are being manually deployed. Maybe I can look into something that hooks up to this repo and deploys everytime there's a code change, BUT to be honest I'm not gonna have this running 24/7 because I don't karaoke 24/7, so I think a manual deployment will work fine.
- Front-End:
    - Currently only using an s3 bucket to host a static website. Any better ideas would be much appreciated, but this website is pretty simple, so this may be it for the front-end.
- Back-End:
    - Flask API:
        - Elastic Beanstalk looks like a pretty promising service. All I care about is that I get the API mapped to a url, and EBS seems to be "input a flask app, output a curlable url".
    - DynamoDB:
        - No big reason why this was chosen. I just found some "Angular-Flask-Dynamodb" guide, and I've stuck with it. Moving to another database would be basically a complete rewrite of the flask api, so maybe let's not do that 💗