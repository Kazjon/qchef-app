import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { MealsPerWeekResponse } from "../../../../core/objects/MealsPerWeekResponse";
import { DataService } from "src/app/services/data/data.service";

@Component({
  selector: "app-onboarding-numberofmeals",
  templateUrl: "./onboarding-numberofmeals.component.html",
  styleUrls: ["./onboarding-numberofmeals.component.scss"],
})
export class OnboardingNumberOfMealsComponent implements OnInit {
  mealsPerWeekResponse: MealsPerWeekResponse;
  percentage: any;
  numberOfMeals: number = 1;
  additionMode: boolean = false;

  @Input() progressValue: any;
  @Input() iconMinus: string;
  @Input() iconPlus: string;

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    if (this.router.url.indexOf("/add") != -1) this.additionMode = true;
    else this.additionMode = false;

    this.setMealsPerWeekResponse(3);
    this.progressValue = this.dataService.getProgressStage();
    this.percentage = this.progressValue;
    this.iconMinus = "../../../assets/images/icon-minus.svg";
    this.iconPlus = "../../../assets/images/icon-plus.svg";
  }

  next() {
    if (!this.additionMode) {
      this.setMealsPerWeekResponse(this.numberOfMeals);
      this.dataService.setMealsPerWeek(this.mealsPerWeekResponse);
      this.router.navigateByUrl("/onboarding/complete");
    } else {
      let mealsPerWeek = this.dataService.getMealsPerWeekFromLocal();
      console.log(mealsPerWeek);
      this.setMealsPerWeekResponse(this.numberOfMeals + mealsPerWeek.number_of_recipes);
      this.dataService.setMealsPerWeek(this.mealsPerWeekResponse);
      this.router.navigateByUrl("/onboarding/complete");
    }
  }

  setMealsPerWeekResponse(meals: number) {
    let uid = localStorage.getItem("userID");
    this.mealsPerWeekResponse = {
      userID: uid,
      number_of_recipes: meals,
    };
  }

  setNumberOfMeals(type: string) {
    if (type == "minus") {
      if (this.numberOfMeals > 1) --this.numberOfMeals;
    } else if (type == "plus") {
      if (this.numberOfMeals < 10) ++this.numberOfMeals;
    }
  }
}
