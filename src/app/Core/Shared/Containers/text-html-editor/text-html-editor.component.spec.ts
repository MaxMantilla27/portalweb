import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextHtmlEditorComponent } from './text-html-editor.component';

describe('TextHtmlEditorComponent', () => {
  let component: TextHtmlEditorComponent;
  let fixture: ComponentFixture<TextHtmlEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextHtmlEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextHtmlEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
