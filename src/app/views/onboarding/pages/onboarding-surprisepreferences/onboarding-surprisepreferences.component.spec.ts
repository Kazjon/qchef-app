import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OnboardingSurprisePreferencesComponent } from './onboarding-surprisepreferences.component';

describe('OnboardingSurprisePreferencesComponent', () => {
  let component: OnboardingSurprisePreferencesComponent;
  let fixture: ComponentFixture<OnboardingSurprisePreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingSurprisePreferencesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardingSurprisePreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
