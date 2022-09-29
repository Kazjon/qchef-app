import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-confirmmodal",
  templateUrl: "./confirmmodal.component.html",
  styleUrls: ["./confirmmodal.component.scss"],
})
export class ConfirmmodalComponent implements OnInit {
  @Input() title: string;
  @Input() description: Array<string>;
  @Input() confirmCallback: Function;
  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  confirm() {
    this.confirmCallback();
  }

  cancel() {
    this.modalController.dismiss();
  }
}
