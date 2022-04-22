import { Component, OnInit } from '@angular/core';
import { BasicCarousel, BasicUrl } from 'src/app/Core/Models/BasicDTO';
import { PartnerImagesDTO } from 'src/app/Core/Models/PartnerImagesDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { PartnerService } from 'src/app/Core/Shared/Services/Partner/partner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  _images: any[] = [ {path: '<div>12</div>'},
  {path: '', width: 0, height: 0}, {path: '', width: 0, height: 0}, {path: '', width: 0, height: 0}, {path: '', width: 0, height: 0} ]
  public imagenes:Array<PartnerImagesDTO>=[];
  public imagenes2:Array<BasicCarousel>=[];
  public step:Array<Array<PartnerImagesDTO>>=[];
  public Carreras: Array<BasicUrl> = [];
  public TituloCarreras = '';
  constructor(

    private _PartnerService:PartnerService,
    private _HelperService :HelperService
  ) { }
  ngOnInit(): void {
    //this.TituloCarreras$ = this._HelperService.recibirString;
    this._HelperService.recibirString.subscribe(x => this.TituloCarreras=x);
    this._HelperService.recibirArray.subscribe({
      next:(x)=>{
        this.Carreras=x.map((c:any)=>{
          var ps:BasicUrl={Nombre:c.Nombre,value:c.value,Url:c.Url};
          return ps;
        });
      }
    });
    this.GetCarrerasProfecionales();
  }

  GetCarrerasProfecionales(){
    this._PartnerService.GetListPartnerImage().subscribe({
      next:(x)=>{
        this.imagenes=x.listaPartnerImagenDTO.map((i:any)=>{
          var ps:PartnerImagesDTO={imgPrincipal:'https://img.bsginstitute.com/repositorioweb/img/partners/'+i.imgPrincipal,imagenAlt:i.imagenAlt};
          return ps;
        });
        this.imagenes2=x.listaPartnerImagenDTO.map((i:any)=>{
          var ps:BasicCarousel={path:'https://img.bsginstitute.com/repositorioweb/img/partners/'+i.imgPrincipal,width:0,height:0};
          return ps;
        });
        var ind=1;
        var stepImages:Array<any>=[];
        this.imagenes.forEach(
          x=>{
            stepImages.push(x);
            if(ind==5){
              this.step.push(stepImages);
              stepImages=[];
              ind=0
            }
            ind++
          }
        );
        this.step.push(stepImages);
      },
      error:(x)=>{console.log(x)}
    });
  }
}
