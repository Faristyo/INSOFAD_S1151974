import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnBooksApprovalComponent } from './return-books-approval.component';

describe('ReturnBooksApprovalComponent', () => {
  let component: ReturnBooksApprovalComponent;
  let fixture: ComponentFixture<ReturnBooksApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnBooksApprovalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReturnBooksApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
