export class Song {
    artist:string;
    songName:string;
    duration:string;

    constructor(id:number, artist:string, songName:string, duration:string) {
        this.artist = artist;
        this.songName = songName;
        this.duration = duration;
    }
}