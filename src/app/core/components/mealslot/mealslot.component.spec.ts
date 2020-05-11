import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MealslotComponent } from './mealslot.component';

describe('MealslotComponent', () => {
  let component: MealslotComponent;
  let fixture: ComponentFixture<MealslotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealslotComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MealslotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
