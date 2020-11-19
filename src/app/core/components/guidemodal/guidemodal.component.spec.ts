import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GuidemodalComponent } from './guidemodal.component';

describe('GuidemodalComponent', () => {
  let component: GuidemodalComponent;
  let fixture: ComponentFixture<GuidemodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuidemodalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GuidemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
