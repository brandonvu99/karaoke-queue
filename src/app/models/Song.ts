export class Song {
    artist:string;
    songName:string;
    duration?:string;
    imageUrl?:any;

    constructor(artist:string, songName:string) {
        this.artist = artist;
        this.songName = songName;
    }
}