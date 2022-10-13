import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { DeleteAccountFailModalComponent } from "./deleteaccountfailmodal.component";

describe("DeleteAccountModalComponent", () => {
   let component: DeleteAccountFailModalComponent;
   let fixture: ComponentFixture<DeleteAccountFailModalComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [DeleteAccountFailModalComponent],
         imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(DeleteAccountFailModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   }));

   it("should create", () => {
      expect(component).toBeTruthy();
   });
});
