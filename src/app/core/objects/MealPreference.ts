import { MealPreferenceQuestion } from './MealPreferenceQuestion';

export interface MealPreference {
    id: string,
    title: string,
    description: string,
    cookTime: string,
    match: string,
    image: string,
    loaded: boolean,
    ingredients: Array<string>,
    method: Array<string>,
    questions?: Array<MealPreferenceQuestion>,
    selected?: boolean,
    disabled?: boolean
}