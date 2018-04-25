import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialerPadComponent } from './dialer-pad.component';

describe('DialerPadComponent', () => {
  let component: DialerPadComponent;
  let fixture: ComponentFixture<DialerPadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialerPadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialerPadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
