export interface IngredientPreferenceQuestionOption {
    title: string,
    selected: boolean
}

export interface IngredientPreferenceQuestion {
    id: string,
    options: Array<IngredientPreferenceQuestionOption>,
    active: boolean
}