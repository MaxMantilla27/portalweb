import { isPlatformBrowser } from "@angular/common";
import { HttpClient, HttpRequest } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { EMPTY, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FacebookPixelService {
  isBrowser: boolean;
  public urlBase = "https://graph.facebook.com/v18.0/269257245868695";

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public SendLoad(id:string,correo:string): Observable<any> {
    console.log(this.router)
    if (this.isBrowser) {
      var dateTime = new Date().getTime();
      var timestamp = Math.floor(dateTime / 1000);
      const formData: FormData = new FormData();
      var json = [
        {
          event_name: "Lead",
          event_time: timestamp,
          action_source: "website",
          event_id: id,
          event_source_url:this.router['location']._platformLocation.location.href,
          user_data: {
            em: [correo]
          },
        },
      ];
      console.log(json);
      formData.append("data", JSON.stringify(json));

      console.log(formData);

      const req = new HttpRequest(
        "POST",
        `${this.urlBase}/events?access_token=EAAHyjC9R3uQBOZCSLa4Kx9ocZAZBXRjECip7lnZAhhpjRJPpGPJrKdOxWJOJqZCjPDuOGwUM2ZC5eTxZBuaDk2oPpKu8M2XaEXIv4pvD8c9ie1A6d89mEPEZCWOW1M2Clt1nKydwOShrFHiNSdAilTkWgZBj443G8p7TZCXCOjXSqHbC16mbl5IvF5ZAZC2rMFtVHwZDZD`,
        formData,
        {
          reportProgress: true,
          responseType: "json",
        }
      );
      return this.http.request(req);
    } else {
      return EMPTY;
    }
  }
}
