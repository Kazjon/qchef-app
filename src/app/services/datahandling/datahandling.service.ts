import { Injectable } from '@angular/core';
import { MealPreference } from 'src/app/core/objects/MealPreference';
import { mealPreferenceQuestions } from '../../../assets/data/mealpreferencequestions';
import { IngredientPreference } from 'src/app/core/objects/IngredientPreference';
import { ingredientPreferenceQuestions } from 'src/assets/data/ingredientpreferencequestions';
import { MealSlot } from 'src/app/core/objects/MealSlot';

@Injectable({
    providedIn: 'root'
})
export class DataHandlingService {

    constructor() { }

    handleMealPreferenceData(data: Object) {

        let resolver = new Promise((resolve, reject) => {

            let mealPreferenceOptions: MealPreference[] = [];

            Object.keys(data).forEach(function(key) {

                let questions = JSON.stringify(mealPreferenceQuestions);

                let cookTime = (data[key].cookTime != null) ? data[key].cookTime.toString() : "NULL";

                let mealPreference: MealPreference = {
                    id: key,
                    title: data[key].title,
                    description: "MISSING",
                    cookTime: cookTime,
                    match: "MISSING",
                    image: "https://q-chef-images.herokuapp.com/image/" + key,
                    loaded: false,
                    ingredients: ["MISSING"], // should be data[key].ingredient_names,
                    ingredientsFull: data[key].ingredient_phrases,
                    method: data[key].steps,
                    questions: JSON.parse(questions)
                }

                mealPreferenceOptions.push(mealPreference);

            });

            resolve(mealPreferenceOptions);

        });

        return resolver;

    }

    handleIngredientPreferenceData(data: Object) {

        let resolver = new Promise((resolve, reject) => {

            let ingredientPreferenceOptions: IngredientPreference[] = [];

            Object.keys(data).forEach(function(key) {

                let questions = JSON.stringify(ingredientPreferenceQuestions);

                let ingredientPreference: IngredientPreference = {
                    id: key,
                    image: "https://q-chef-images.herokuapp.com/ingredient_image/" + key,
                    title: data[key],
                    loaded: false,
                    questions: JSON.parse(questions)
                }

                ingredientPreferenceOptions.push(ingredientPreference);

            });

            resolve(ingredientPreferenceOptions);

        });

        return resolver;

    }

    handleMealSlotData(data: Object) {

        let resolver = new Promise((resolve, reject) => {

            let mealSlots: MealSlot[] = [];

            Object.keys(data).forEach(function(key, index) {

                let cookTime = (data[key].cookTime != null) ? data[key].cookTime.toString() : "NULL";

                let recipe: MealPreference = {
                    id: key,
                    title: data[key].title,
                    description: "MISSING",
                    cookTime: cookTime,
                    match: "MISSING",
                    image: "https://q-chef-images.herokuapp.com/image/" + key,
                    loaded: false,
                    ingredients: ["MISSING"], // should be data[key].ingredient_names
                    ingredientsFull: data[key].ingredient_phrases,
                    method: data[key].steps
                }

                let mealSlot: MealSlot = {
                    id: (index + 1),
                    selected: false,
                    active: false,
                    recipe: recipe
                }

                mealSlots.push(mealSlot);

            });

            console.log(mealSlots);

            resolve(mealSlots);

        });

        return resolver;

    }
}
