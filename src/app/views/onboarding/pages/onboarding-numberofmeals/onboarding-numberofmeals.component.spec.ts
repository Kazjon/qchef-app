import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OnboardingNumberofmealsComponent } from './onboarding-numberofmeals.component';

describe('OnboardingNumberofmealsComponent', () => {
  let component: OnboardingNumberofmealsComponent;
  let fixture: ComponentFixture<OnboardingNumberofmealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingNumberofmealsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardingNumberofmealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
