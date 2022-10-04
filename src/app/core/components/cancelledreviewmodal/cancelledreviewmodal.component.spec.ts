import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { CancelledReviewModalComponent } from "./cancelledreviewmodal.component";

describe("CancelledReviewModalComponent", () => {
   let component: CancelledReviewModalComponent;
   let fixture: ComponentFixture<CancelledReviewModalComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [CancelledReviewModalComponent],
         imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(CancelledReviewModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   }));

   it("should create", () => {
      expect(component).toBeTruthy();
   });
});
