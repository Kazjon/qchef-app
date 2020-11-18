import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientmodalComponent } from './ingredientmodal/ingredientmodal.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        IngredientmodalComponent
    ],
    declarations: [
        IngredientmodalComponent
    ],
    entryComponents: [
        IngredientmodalComponent
    ]
})
export class SharedComponentsModule { }