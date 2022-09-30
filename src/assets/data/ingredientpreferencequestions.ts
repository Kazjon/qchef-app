export const ingredientPreferenceQuestions = [
   {
      id: "familiarity_ratings",
      title: "Familiarity",
      options: [
         {
            id: 2,
            title: "I <strong>know</strong> how this tastes",
            selected: false,
         },
         {
            id: 1,
            title: "I have <strong>some</strong> idea how this tastes",
            selected: false,
         },
         {
            id: 0,
            title: "I <strong>don't</strong> really know how this tastes",
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
            title: "I <strong>like</strong> to eat this",
            selected: false,
         },
         {
            id: 1,
            title: "I <strong>sometimes like</strong> to eat this",
            selected: false,
         },
         {
            id: 2,
            title: "I <strong>don't like</strong> to eat this",
            selected: false,
         },
      ],
      active: false,
      disabled: false,
   },
];
