
export class AlumnosTest {
  public idalumno=[
    9818325,9923729
  ]
  Allpermisions(id:number):boolean{
    if(this.idalumno.find(element => element ==id)){
      return true;
    }
    return false
  }
}
