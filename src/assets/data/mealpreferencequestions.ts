export const mealPreferenceQuestions = [
   {
      id: "familiarity_ratings",
      title: "Familiarity",
      options: [
         {
            id: 2,
            title: "I'm <strong>pretty sure</strong> I know how this would taste",
            selected: false,
         },
         {
            id: 1,
            title: "I have <strong>some idea</strong> of how this would taste",
            selected: false,
         },
         {
            id: 0,
            title: "I <strong>don't really</strong> know how this would taste",
            selected: false,
         },
      ],
      active: true,
      disabled: false,
   },
   {
      id: "taste_ratings",
      title: "Enjoyment",
      options: [
         {
            id: 2,
            title: "I <strong>think</strong> I would enjoy eating this",
            selected: false,
         },
         {
            id: 1,
            title: "I'm <strong>not sure</strong> I would enjoy eating this",
            selected: false,
         },
         {
            id: 0,
            title: "I <strong>don't think</strong> I would enjoy eating this",
            selected: false,
         },
      ],
      active: false,
      disabled: false,
   },
   {
      id: "surprise_ratings",
      title: "Ingredients",
      options: [
         {
            id: 0,
            title: "These ingredients <strong>are what I expected</strong>",
            selected: false,
         },
         {
            id: 2,
            title: "I had <strong>no idea</strong> what ingredients to expect",
            selected: false,
         },
         {
            id: 1,
            title: "<strong>Some</strong> ingredients were <strong>not</strong> what I expected",
            selected: false,
         },
      ],
      active: false,
      disabled: false,
   },
];
