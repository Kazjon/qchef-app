import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DataService } from "src/app/services/data/data.service";

@Component({
   selector: "app-onboarding-getstarted",
   templateUrl: "./onboarding-getstarted.page.html",
   styleUrls: ["./onboarding-getstarted.page.scss"],
})
export class OnboardingGetStartedPage implements OnInit {
   imgSrc: string = "../../../assets/images/header-logo.svg";
   constructor(private router: Router, private dataService: DataService) {}

   ngOnInit() {
      this.dataService.arbitraryOnboardingTimeout = 2000;
      this.dataService.setOnboardingStage("begin");
   }

   getStarted() {
      this.router.navigateByUrl("/onboarding/mealpreferences");
   }
}
