
export class ImagenTarjetas {
  public Tarjetas:Array<{codigo:string,img:string}>=[{
    codigo:"VS",
    img:'visa-07.svg'
  },{
    codigo:'MC',
    img:'mastercard-08.svg'
  },{
    codigo:'AMX',
    img:'american-09.svg'
  },{
    codigo:'DC',
    img:'dinners-10.svg'
  },{
    codigo:'PSE',
    img:'pse-colombia.svg'
  },{
    codigo:'CN',
    img:'carnet-mexico.svg'
  }]
  constructor() { }
  GetTarjeta(coidgo:string):string{
    var find=this.Tarjetas.find(x=>x.codigo.toLowerCase()==coidgo.toLowerCase());
    if(find!=undefined){
      return find.img;
    }
    return '';
  }
  GetWebMoneda(moneda:string):number{
    if(this.removeAccents(moneda.toLowerCase())=='soles') return 0;
    if(this.removeAccents(moneda.toLowerCase())=='dolares') return 1;
    if(this.removeAccents(moneda.toLowerCase())=='pesos colombianos') return 2;
    if(this.removeAccents(moneda.toLowerCase())=='pesos bolivianos') return 3;
    if(this.removeAccents(moneda.toLowerCase())=='pesos mexicanos') return 4;
    return 0;
  }

  removeAccents(strng:string){
    return strng.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }
}
