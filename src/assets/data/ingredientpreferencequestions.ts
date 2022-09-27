export const ingredientPreferenceQuestions = [
  {
    id: "familiarity_ratings",
    title: "Familiarity",
    options: [
      {
        id: 2,
        title: "I know how this tastes",
        selected: false,
      },
      {
        id: 1,
        title: "I have some idea how this tastes",
        selected: false,
      },
      {
        id: 0,
        title: "I don't really know how this tastes",
        selected: false,
      },
    ],
    active: true,
    disabled: false,
  },
  {
    id: "taste_ratings",
    title: "Taste",
    options: [
      {
        id: 0,
        title: "I like to eat this",
        selected: false,
      },
      {
        id: 1,
        title: "I sometimes like to eat this",
        selected: false,
      },
      {
        id: 2,
        title: "I don't like to eat this",
        selected: false,
      },
    ],
    active: false,
    disabled: false,
  },
];
