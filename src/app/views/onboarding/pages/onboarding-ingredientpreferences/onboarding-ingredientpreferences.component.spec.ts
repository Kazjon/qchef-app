import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OnboardingIngredientpreferencesComponent } from './onboarding-ingredientpreferences.component';

describe('OnboardingIngredientpreferencesComponent', () => {
  let component: OnboardingIngredientpreferencesComponent;
  let fixture: ComponentFixture<OnboardingIngredientpreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingIngredientpreferencesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardingIngredientpreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
