# Karaoke Queue App

This app creates a (priority) queue of songs, which are requested by users. There is a front-end created in Angular and a back-end created in Flask which communicates with DynamoDB.

# Front-End
The front-end has these capabilities:

    - Allows users to submit a song
    - Allows users to upvote songs
    - Allows users to remove songs that only they themself requested

Songs will be refreshed every so often on the page.

# Back-End
The back-end api has these capabilities:

    - A