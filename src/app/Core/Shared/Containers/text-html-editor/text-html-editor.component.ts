import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { CKEditor4 } from 'ckeditor4-angular';

@Component({
  selector: 'app-text-html-editor',
  templateUrl: './text-html-editor.component.html',
  styleUrls: ['./text-html-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TextHtmlEditorComponent implements OnInit {

  constructor() { }
  @Input() htmlContent='';
  @Output() htmlContentChange = new EventEmitter<string>();
  ngOnInit(): void {
  }
  change(event: CKEditor4.EventInfo){
    this.htmlContent=event.editor.getData()
    this.htmlContentChange.emit(this.htmlContent)
  }
}
