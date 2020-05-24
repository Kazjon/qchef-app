import { IngredientPreferenceQuestion } from './IngredientPreferenceQuestion';

export interface IngredientPreference {
    id: string,
    image: string,
    title: string,
    questions?: Array<IngredientPreferenceQuestion>
}