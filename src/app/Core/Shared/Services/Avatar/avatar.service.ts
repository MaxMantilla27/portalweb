import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { AvatarDTO, AvatarEnvioDTO } from 'src/app/Core/Models/Avatar';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Avatar';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerAvatar():Observable<any>{

    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerAvatar');
    }else{
      return EMPTY;
    }
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
  public ActualizarAvatar(Json:AvatarEnvioDTO):Observable<any>{
    console.log(Json)
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/ActualizarAvatar',Json);
    }else{
      return EMPTY;
    }
  }
}
