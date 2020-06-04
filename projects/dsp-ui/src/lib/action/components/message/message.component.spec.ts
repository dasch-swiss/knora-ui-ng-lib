import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterTestingModule } from '@angular/router/testing';
import { StatusMsg } from '../../../assets/i18n/statusMsg';
import { MessageComponent } from './message.component';

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;
  let status: StatusMsg;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
            MatCardModule,
            MatIconModule,
            MatListModule,
            RouterTestingModule
        ],
        providers: [
            StatusMsg
        ],
        declarations: [MessageComponent]
    }).compileComponents();

    status = TestBed.inject(StatusMsg);

}));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
