import { SET_RECIPES, SET_RECIPE_ID } from "./actions";

const initialState = {
    recipes: [],
    recipeID: 0
};

export default function recipeReducer(state = initialState, action) {
    switch (action.type) {
        case SET_RECIPES:
            return { ...state, recipes: action.payload };
        case SET_RECIPE_ID:
            return { ...state, recipeID: action.payload };
        default:
            return state;
    }
}