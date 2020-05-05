import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MealselectionSelectmealComponent } from './mealselection-selectmeal.component';

describe('MealselectionSelectmealComponent', () => {
  let component: MealselectionSelectmealComponent;
  let fixture: ComponentFixture<MealselectionSelectmealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealselectionSelectmealComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MealselectionSelectmealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
