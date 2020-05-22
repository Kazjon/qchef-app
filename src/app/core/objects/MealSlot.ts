import { MealPreference } from './MealPreference';

export interface MealSlot {
    id: number,
    recipe?: MealPreference
    selected: boolean,
    reviewed: boolean,
    active: boolean
}