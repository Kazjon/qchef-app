export interface MealPreferenceQuestionOption {
    id: number,
    title: string,
    selected: boolean
}

export interface MealPreferenceQuestion {
    id: string,
    options: Array<MealPreferenceQuestionOption>,
    active: boolean,
    disabled: boolean
}