
export class AlumnosTest {
  public idalumno=[
    9818325,9923729,10346443
  ]
  public idAlumnoCarrera=[10332441]
  Allpermisions(id:number):boolean{
    if(this.idalumno.find(element => element ==id)){
      return true;
    }
    return false
  }
  PermisosCarrea(id:number):boolean{
    if(this.idAlumnoCarrera.find(element => element ==id)){
      return true;
    }
    return false
  }
}
