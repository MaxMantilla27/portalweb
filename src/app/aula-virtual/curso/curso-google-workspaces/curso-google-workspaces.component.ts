import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-curso-google-workspaces',
  templateUrl: './curso-google-workspaces.component.html',
  styleUrls: ['./curso-google-workspaces.component.scss']
})
export class CursoGoogleWorkspacesComponent implements OnInit {

  constructor() { }

  @Input() Tipo=''
  ngOnInit(): void {
  }

}
