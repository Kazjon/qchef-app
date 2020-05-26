import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { MealSlot } from 'src/app/core/objects/MealSlot';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-reviews-form',
  templateUrl: './reviews-form.component.html',
  styleUrls: ['./reviews-form.component.scss'],
})
export class ReviewsFormComponent implements OnInit {
  id: any;
  mealTitle: string;
  mealSlots: MealSlot[];
  reviewForm: FormGroup;
  formSubmitted: boolean = false;
  formDisabled: boolean = false;
  errorMessage: string = undefined;

  isReasonValid: boolean = true;
  isFeelingValid: boolean = true;
  isTasteValid: boolean = true;
  isEnjoyValid: boolean = true;
  isTryAgainValid: boolean = true;

  tasteValue: string = '';
  enjoyValue: string = '';
  tryAgainValue: string = '';

  photo: SafeResourceUrl;

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) { 
    }

  ngOnInit() {
    this.dataService.getMealSlotsFromLocal();
    this.dataService.getWeekStartDateFromLocal();

    combineLatest(
        this.dataService.mealSlotsObservable
    ).pipe(
        take(2)
    )
    .subscribe(([mealSlots]) => {
        this.checkData(mealSlots);
    });

    this.route.paramMap.subscribe( paramMap => {
        this.id = paramMap.get('id');
    })

    this.getMealTitle();

    this.reviewForm = this.formBuilder.group({
      photo: ['', [
          Validators.required
      ]],
      reason: ['', [
          Validators.required
      ]],
      feeling: ['', [
          Validators.required
      ]],
      taste: ['', [
          Validators.required
      ]],
      enjoy: ['', [
          Validators.required
      ]],
      tryAgain: ['', [
          Validators.required
      ]]
    });

  }

  private checkData(data) {
    if (data.length <= 0 || data[0].recipe == undefined) {
       this.router.navigateByUrl('mealselection/meal/1', { replaceUrl: true });
    }
    else {
        this.mealSlots = data;
    }
  }

  private getMealTitle() {
    this.mealSlots.forEach(element => {
      if(element.recipe.id == this.id)
      this.mealTitle = element.recipe.title;
    });
    
  }

  submitReview() {
    if (this.reviewForm.valid) {
      console.log('valid.....')
      this.isReasonValid = true;
      this.isFeelingValid = true;
      this.isTasteValid = true;
      this.isEnjoyValid = true;
      this.isTryAgainValid = true;
    } else {
      Object.keys(this.reviewForm.controls).forEach(key => {
        console.log('key.. ', key)
        let abstractControl: AbstractControl = this.reviewForm.get(key);
        console.log('abstractControl.. ', abstractControl)

        if (key == "reason") {
          if (abstractControl.status == 'INVALID') 
            this.isReasonValid = false;
          else
            this.isReasonValid = true;
        }

        if (key == "feeling") {
          if(abstractControl.status == 'INVALID') 
            this.isFeelingValid = false;
          else 
            this.isFeelingValid = true;
        }

        if (key == "taste") {
          if (abstractControl.status == 'INVALID') 
            this.isTasteValid = false;
          else 
            this.isTasteValid = true;
        }

        if (key == "enjoy") {
          if (abstractControl.status == 'INVALID')
            this.isEnjoyValid = false;
          else
            this.isEnjoyValid = true;
        }

        if (key == "tryAgain") {
          if(abstractControl.status == 'INVALID')
            this.isTryAgainValid = false;
          else
            this.isTryAgainValid = true;
        }
			})
    }
  }

  updateTextarea(label: string, event: any) {
    if (label == 'reason') {
      if(event.detail.value != '') {
        this.isReasonValid = true;
      } else {
        this.isReasonValid = false;
      }
    } else if (label == 'feeling') {
      if(event.detail.value != '') {
        this.isFeelingValid = true;
      } else {
        this.isFeelingValid = false;
      }
    }

  }

  updateRadioValue(label: string, event: any) {
    if (label == 'taste') {
      if(event.detail.value != '') {
        this.isTasteValid = true;
      } else {
        this.isTasteValid = false;
      }
    } else if (label == 'enjoy') {
      if(event.detail.value != '') {
        this.isEnjoyValid = true;
      } else {
        this.isEnjoyValid = false;
      }
    } else if (label == 'tryAgain') {
      if(event.detail.value != '') {
        this.isTryAgainValid = true;
      } else {
        this.isTryAgainValid = false;
      }
    }

  }

  uploadPhoto() {
    
  }

  
}
