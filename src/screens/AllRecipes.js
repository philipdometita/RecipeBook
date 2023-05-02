import {
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList,
    Alert,
    useWindowDimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'

import { useDispatch, useSelector } from 'react-redux'
import { setRecipeID, setRecipes } from '../redux/actions'

import Card from '../utils/Card'
import { GlobalStyles, Colors, normalizeSize, normalizeWidth, normalizeHeight } from "../utils/GlobalStyles"
import SearchBar from '../utils/SearchBar';
import FilterMenu from './FilterMenu'

// main screen for displaying all saved recipes
// navigation: from react native navigation
const Recipes = ({ navigation }) => {
    const dispatch = useDispatch()
    
    // get recipes from redux
    const { recipes } = useSelector(state => state.recipeReducer)

    // get device screen height and width
    const { height, width } = useWindowDimensions()

    // state for the search bar
    const [search, setSearch] = useState('')

    // primary filter values: 'earlyLast', 'earlyFirst', 'cookTimeLow', 'cookTimeHigh', 'servingsLow', 'servingsHigh'
    const [primaryFilter, setPrimaryFilter] = useState('earlyLast')
    const [tagFilter, setTagFilter] = useState([])

    // effect to add a submit button to the header of the stack navigator
    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <SearchBar search={search} setSearch={setSearch} navigation={navigation} />
            )
        })
    })

    // method for deleting a recipe. updates async storage and redux
    // id: id of recipe to be deleted
    const deleteRecipe = id => {
        const filteredRecipes = recipes.filter(recipe => recipe.Id !== id)
        AsyncStorage.setItem('Recipes', JSON.stringify(filteredRecipes))
            .then(() => {
                dispatch(setRecipes(filteredRecipes))
                Alert.alert('Success', 'Recipe deleted')
            })
            .catch(error => console.log(error))
    }

    // go to the recipe page for chosen recipe
    // id: id of chosen recipe
    const goToRecipe = id => {
        dispatch(setRecipeID(id))
        navigation.navigate("Recipe")
    }

    // go to recipe edit screen
    // only used when creating new recipe 
    // can be used if adding alternate way to edit recipe (ex. option in hold menu) 
    // id: id of recipe to edit (new id is given when creating new recipe)
    const editRecipe = id => {
        dispatch(setRecipeID(id))
        navigation.navigate("RecipeEdit")
    }

    // filters recipes based on search and/or sort and tag filters
    // recipes: recipes object from redux
    // returns filtered recipe object
    const filterRecipes = recipes => {
        let filteredRecipes = [...recipes]

        // if tags are selected, filter out recipes that don't contain the selected tags
        if (tagFilter.length > 0) {
            filteredRecipes = recipes.filter(recipe => (
                tagFilter.every(tag => recipe.Tags.includes(tag))
            ))
        }

        // filters recipes based on search bar input
        // searches titles and descriptions
        filteredRecipes = filteredRecipes.filter(recipe => {
            if (recipe.Title.toUpperCase().trim().replace(/\s/g, '').includes(search.toUpperCase().trim().replace(/\s/g, ''))) {
                return true
            } else if (recipe.Description.toUpperCase().trim().replace(/\s/g, '').includes(search.toUpperCase().trim().replace(/\s/g, ''))) {
                return true
            } else {
                return false
            }
        })

        // return filtered recipes after sorting 
        return sortRecipes(filteredRecipes)
    }

    // sorts given recipes array by the primary filter state
    // recipes: array to be sorted
    const sortRecipes = recipes => {
        switch (primaryFilter) {
            // recipes is stored early last by default
            case 'earlyLast':
                return recipes
            
            // since recipes is stored early last, just reverese array for early first
            case 'earlyFirst':
                return recipes.reverse()
            
            // convert cook time to minutes and sort lowest cook time first
            case 'cookTimeLow':
                return recipes.sort((recipe1, recipe2) => (
                    ((recipe1.CookTime.days * 1440) + (recipe1.CookTime.hours * 60) + recipe1.CookTime.minutes) -
                    ((recipe2.CookTime.days * 1440) + (recipe2.CookTime.hours * 60) + recipe2.CookTime.minutes)
                ))
            
            // convert cook time to minutes and sort lowest cook time last
            case 'cookTimeHigh':
                return recipes.sort((recipe1, recipe2) => (
                    ((recipe2.CookTime.days * 1440) + (recipe2.CookTime.hours * 60) + recipe2.CookTime.minutes) -
                    ((recipe1.CookTime.days * 1440) + (recipe1.CookTime.hours * 60) + recipe1.CookTime.minutes) 
                ))
            
            // sort by lowest servings made first
            case 'servingsLow':
                return recipes.sort((recipe1, recipe2) => recipe1.Servings - recipe2.Servings)
            
            // sort by lowest servings made last
            case 'servingsHigh':
                return recipes.sort((recipe1, recipe2) => recipe2.Servings - recipe1.Servings)
            
            default: 
                return recipes
        }
    }

    return (
        <View style={[styles.body, { width: width, height: height }]}> 
            <FlatList
                columnWrapperStyle={styles.cards}
                key={'_'}
                data={filterRecipes(recipes)}
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Card recipe={item} width={width} deleteRecipe={deleteRecipe} goToRecipe={goToRecipe} />
                    </View> 
                )}
            />

            <FilterMenu primaryFilter={primaryFilter} setPrimaryFilter={setPrimaryFilter} tagFilter={tagFilter} setTagFilter={setTagFilter} />
            
            <TouchableOpacity 
                style={styles.circleButton}
                onPress={() => editRecipe(uuid.v4())}
            >
                <MaterialCommunityIcons 
                    name={'plus'}
                    size={normalizeSize(25)}
                    color={Colors.white}
                />
            </TouchableOpacity>
        </View>
    )
}

export default Recipes

const styles = StyleSheet.create({
    body: { 
        flex: 1,
        backgroundColor: Colors.extraLightGold,
    },
    circleButton: {
        width: normalizeWidth(50),
        height: normalizeWidth(50),
        borderRadius: 50,
        backgroundColor: Colors.darkGold,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: normalizeHeight(10),
        right: normalizeWidth(10),
        elevation: 5,
        zIndex: 5
    },
    item: {
        paddingVertical: normalizeHeight(10),
        paddingHorizontal: normalizeWidth(10),
        flexDirection: 'column',
    },
    cards: {
        justifyContent: 'space-around',
    },
    thinLine: {
        width: '100%',
        borderBottomColor: Colors.gold,
        borderBottomWidth: normalizeWidth(1),
        marginBottom: normalizeHeight(10),
        marginTop: normalizeHeight(2)
    }
})

