import * as moment from 'moment';

export class Song {

    song_queue_id:string;
    id:string;
    user_id:string;
    date_created:moment.Moment;
    artist:string;
    song_name:string;
    duration?:number;
    duration_readable?:string;
    upvotes:number;
    image_url?:string;

    constructor(songQueueId:string, id:string, userId:string, dateCreated:moment.Moment, artist:string, songName:string, duration:number, upvotes:number, imageUrl:string) {
        this.song_queue_id = songQueueId;
        this.id = id;
        this.user_id = userId;
        this.date_created = dateCreated;
        this.artist = artist;
        this.song_name = songName;
        this.duration = duration;
        this.upvotes = upvotes;
        this.image_url = imageUrl;
    }

    public toString = () : string => {
        return `Song Object: {artist: ${this.artist}, songName: ${this.song_name}, duration: ${this.duration}, duration_readable: ${this.duration_readable}, timeAdded: ${this.date_created}, imageUrl: ${this.image_url}}`;
    }
}