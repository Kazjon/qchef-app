import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-guidemodal',
  templateUrl: './guidemodal.component.html',
  styleUrls: ['./guidemodal.component.scss'],
})
export class GuidemodalComponent implements OnInit {
  @Input() title: string;
  @Input() description: Array<string>;
  constructor(public modalController: ModalController) { }

  ngOnInit() {
    
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
