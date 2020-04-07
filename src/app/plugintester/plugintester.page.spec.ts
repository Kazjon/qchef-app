import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlugintesterPage } from './plugintester.page';

describe('PlugintesterPage', () => {
  let component: PlugintesterPage;
  let fixture: ComponentFixture<PlugintesterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlugintesterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlugintesterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
