export interface IngredientPreferenceQuestionOption {
    id: number,
    title: string,
    selected: boolean
}

export interface IngredientPreferenceQuestion {
    id: string,
    options: Array<IngredientPreferenceQuestionOption>,
    active: boolean
}