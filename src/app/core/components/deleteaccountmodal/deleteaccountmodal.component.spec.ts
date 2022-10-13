import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { DeleteAccountModalComponent } from "./deleteaccountmodal.component";

describe("DeleteAccountModalComponent", () => {
   let component: DeleteAccountModalComponent;
   let fixture: ComponentFixture<DeleteAccountModalComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [DeleteAccountModalComponent],
         imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(DeleteAccountModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   }));

   it("should create", () => {
      expect(component).toBeTruthy();
   });
});
