import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MealPreference } from '../../core/MealPreference';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(private http: HttpClient) { }

    getMealsFromServer(): Observable<MealPreference[]> {
        return this.http.get<MealPreference[]>('assets/data/mealpreferences.json');
    }
}
