import { MealPreferenceQuestion } from './MealPreferenceQuestion';

export interface MealPreference {
    id: number,
    title: string,
    description: string,
    cookTime: string,
    match: string,
    image: string,
    ingredients: Array<string>,
    method: Array<string>,
    questions?: Array<MealPreferenceQuestion>
}