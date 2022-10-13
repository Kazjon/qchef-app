import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { DataService } from "src/app/services/data/data.service";
import { FirebaseService } from "src/app/services/firebase/firebase.service";
import { DeleteAccountFailModalComponent } from "../deleteaccountfailmodal/deleteaccountfailmodal.component";

@Component({
   selector: "app-deleteaccountmodal",
   templateUrl: "./deleteaccountmodal.component.html",
   styleUrls: ["./deleteaccountmodal.component.scss"],
})
export class DeleteAccountModalComponent implements OnInit {
   constructor(
      public modalController: ModalController,
      private dataService: DataService,
      private firebaseService: FirebaseService,
      private router: Router
   ) {}

   errorMessage: string = "";

   ngOnInit() {}

   confirmDelete() {
      this.dataService.postDeleteAccountToServer().subscribe(
         () => {
            this.modalController.dismiss();
            this.firebaseService
               .logoutUserFromApp()
               .then(() => {
                  this.router.navigateByUrl("login", { replaceUrl: true });
               })
               .catch(() => {});
         },
         async () => {
            this.modalController.dismiss();
            const modal = await this.modalController.create({
               component: DeleteAccountFailModalComponent,
               cssClass: "delete-account-fail-modal",
            });
            modal.present();
         }
      );
      /*this.getMealPlanSelectionFromServer(mealsPerWeek).subscribe((res) => {
                this.dataHandlingService.handleMealSlotData(res)
                    .then((organisedData: MealSlot[]) => {
                        mealSlots = organisedData;
                        this.setMealSlots(mealSlots);
                    });
            },);*/
   }

   closeModal() {
      this.modalController.dismiss();
   }
}
