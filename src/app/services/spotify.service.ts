import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  accessToken:string|null = null;
  client_id:string = '***REMOVED***'
  client_secret:string = '***REMOVED***'

  constructor(private http:HttpClient) {
  }

  getAccessToken():Observable<any> {
    return this.http.post<any>("https://accounts.spotify.com/api/token",
      new HttpParams()
        .set('grant_type', "client_credentials").toString(),
      {
        headers: {
          "Authorization": `Basic ${btoa(this.client_id + ":" + this.client_secret)}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        // params: {
        //   grant_type: "client_credentials"
        // },
        responseType: 'json' as 'json'
      }
    )
  }

  async getSongImageUrlAndDuration(query:string): Promise<Observable<any>> {
    if (this.accessToken === null) {
      let response = await this.getAccessToken().toPromise();
      if (response) {
        this.accessToken = response.access_token
        console.log(`fetched auth token from spotify`)
      } else {
        console.log(`couldn't fetch auth token from spotify, using random static string ${this.accessToken} \n ${response}}`)
      }
    }
    let imageUrl!:string;
    let songDuration!:number;
    return this.http.get<any>("https://api.spotify.com/v1/search",
    {
      headers: {
        "Authorization": `Bearer ${this.accessToken}`,
        "Accept": "application/json"
      },
      params: new HttpParams().set('q', `${query}`).set('type', 'track').set('market', 'US').set('limit', '10').set('offset', '0'),
      responseType: 'json' as 'json'
    })
  }
}

// export interface SpotifyTokenResponse {
//   access_token: string,
//   token_type: string,
//   expires_in: number,
// }

export interface Image {
  height:number;
  url:string;
  width:number;
}