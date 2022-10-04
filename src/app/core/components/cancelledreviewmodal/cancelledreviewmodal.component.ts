import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
   selector: "app-cancelledreviewmodal",
   templateUrl: "./cancelledreviewmodal.component.html",
   styleUrls: ["./cancelledreviewmodal.component.scss"],
})
export class CancelledReviewModalComponent implements OnInit {
   constructor(public modalController: ModalController) {}

   ngOnInit() {}

   closeModal() {
      this.modalController.dismiss();
   }
}
