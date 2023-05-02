import { configureStore } from '@reduxjs/toolkit';
import recipeReducer from './reducers';

export const Store = configureStore({ reducer: {recipeReducer} });