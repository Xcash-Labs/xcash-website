import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XCashDetailsComponent } from './xcash-details.component';

describe('XCashDetailsComponent', () => {
  let component: XCashDetailsComponent;
  let fixture: ComponentFixture<XCashDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XCashDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XCashDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
