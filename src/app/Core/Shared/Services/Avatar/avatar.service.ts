import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AvatarDTO } from 'src/app/Core/Models/Avatar';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  public urlBase=environment.url_api+'Avatar';
  constructor(private http: HttpClient) { }

  public ObtenerAvatar():Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerAvatar');
  }

  GetUrlImagenAvatar(avatar:AvatarDTO):string{
    var url='https://avataaars.io/?avatarStyle=Circle&topType=';
    url +=avatar.topC+'&accessoriesType=';
    url +=avatar.accessories+'&hairColor=';
    url +=avatar.hair_Color+'&facialHairType=';
    url +=avatar.facial_Hair+'&facialHairColor=';
    url +=avatar.facial_Hair_Color+'&clotheType=';
    url +=avatar.clothes+'&clotheColor=';
    url +=avatar.clothes_Color+'&eyeType=';
    url +=avatar.eyes+'&eyebrowType=';
    url +=avatar.eyesbrow+'&mouthType=';
    url +=avatar.mouth+'&skinColor=';
    url +=avatar.skin;
    return url;
  }
}
