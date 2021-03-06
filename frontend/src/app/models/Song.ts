import * as moment from 'moment';

export class Song {

    song_queue_id:string;
    id:string;
    requester_id:string;
    date_created:moment.Moment;
    artist:string;
    song_name:string;
    duration_ms:number;
    duration_readable?:string;
    upvotes:string[];
    image_url?:string;

    constructor(song_queue_id:string, id:string, requester_id:string, date_created:moment.Moment, artist:string, song_name:string, duration_ms:number, upvotes:string[], image_url:string) {
        this.song_queue_id = song_queue_id;
        this.id = id;
        this.requester_id = requester_id;
        this.date_created = date_created;
        this.artist = artist;
        this.song_name = song_name;
        this.duration_ms = duration_ms;
        this.upvotes = upvotes;
        this.image_url = image_url;
    }

    public toString = () : string => {
        return `Song Object: {artist: ${this.artist}, songName: ${this.song_name}, duration: ${this.duration_ms}, duration_readable: ${this.duration_readable}, timeAdded: ${this.date_created}, imageUrl: ${this.image_url}}`;
    }
}