import { IngredientPreferenceQuestion } from './IngredientPreferenceQuestion';

export interface IngredientPreference {
    id: number,
    image: string,
    title: string,
    questions?: Array<IngredientPreferenceQuestion>
}