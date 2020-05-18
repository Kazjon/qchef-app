export interface MealPreferenceQuestionOption {
    title: string,
    selected: boolean
}

export interface MealPreferenceQuestion {
    id: string,
    options: Array<MealPreferenceQuestionOption>,
    active: boolean
}