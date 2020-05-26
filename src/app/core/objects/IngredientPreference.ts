import { IngredientPreferenceQuestion } from './IngredientPreferenceQuestion';

export interface IngredientPreference {
    id: string,
    image: string,
    loaded: boolean,
    title: string,
    questions?: Array<IngredientPreferenceQuestion>
}