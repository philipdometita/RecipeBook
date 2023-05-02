export const SET_RECIPES = 'SET_RECIPE';
export const SET_RECIPE_ID = 'SET_RECIPE_ID';

export const setRecipes = recipes => dispatch => {
    dispatch({
        type: SET_RECIPES,
        payload: recipes
    })
}
export const setRecipeID = recipeID => dispatch => {
    dispatch({
        type: SET_RECIPE_ID,
        payload: recipeID
    })
}