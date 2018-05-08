import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingManagerComponent } from './meeting-manager.component';

describe('MeetingManagerComponent', () => {
  let component: MeetingManagerComponent;
  let fixture: ComponentFixture<MeetingManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
