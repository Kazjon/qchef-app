import { MealPreference } from './MealPreference';

export interface MealSlot {
    id: number,
    recipe?: MealPreference
    selected: boolean,
    active: boolean
}