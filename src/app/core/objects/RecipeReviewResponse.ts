export interface RecipeReviewResponse {
    cook_ratings: Object,
    taste_ratings: Object,
    familiarity_ratings: Object,
    why_response: Object,
    how_response: Object,
    image: Object
}

/*
{
	"userID": "42",
	"cook_ratings": {
		"60372": 1,
		"27455": 2
	},
	"taste_ratings": {
		"60372": 2,
		"27455": 2
	},
	"familiarity_ratings": {
		"60372": 2,
		"27455": 0
	},
	"why_response": {
		"60372": "CHICKEN!1!",
		"27455": "The chocolate element combined with beef seemed interesting."
	},
	"how_response": {
		"60372": "It's chicken, so of course it was fantastic!",
		"27455": "The chocolate surprisingly worked really well with the beef. Was not expecting it to be soooo good. Will definitely be cooking it again."
	},
	"image": {
		"60372": "",
		"27455": ""
	}
}*/
