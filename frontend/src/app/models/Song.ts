import * as moment from 'moment';

export class Song {
    artist:string;
    songName:string;
    duration?:moment.Duration;
    duration_readable?:string;
    timeAdded:moment.Moment;
    imageUrl?:any;
    upvotes?:number;

    constructor(artist:string, songName:string, timeAdded:moment.Moment) {
        this.artist = artist;
        this.songName = songName;
        this.timeAdded = timeAdded;
    }

    public toString = () : string => {
        return `Song Object: {artist: ${this.artist}, songName: ${this.songName}, duration: ${this.duration}, duration_readable: ${this.duration_readable}, timeAdded: ${this.timeAdded}, imageUrl: ${this.imageUrl}}`;
    }
}