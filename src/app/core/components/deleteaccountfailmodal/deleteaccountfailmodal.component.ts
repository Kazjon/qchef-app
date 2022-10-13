import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { DataService } from "src/app/services/data/data.service";
import { FirebaseService } from "src/app/services/firebase/firebase.service";

@Component({
   selector: "app-deleteaccountfailmodal",
   templateUrl: "./deleteaccountfailmodal.component.html",
   styleUrls: ["./deleteaccountfailmodal.component.scss"],
})
export class DeleteAccountFailModalComponent implements OnInit {
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
            this.firebaseService
               .logoutUserFromApp()
               .then(() => {
                  this.router.navigateByUrl("login", { replaceUrl: true });
               })
               .catch(() => {});
         },
         () => {
            console.log("FAILED");
            this.errorMessage = "Server error.  Please wait a moment and try again";
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
