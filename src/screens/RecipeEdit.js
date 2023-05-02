import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    Alert,
    TextInput,
    Image,
    TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useDispatch, useSelector } from 'react-redux'
import { setRecipes } from '../redux/actions'
import * as ImagePicker from 'expo-image-picker'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import uuid from 'react-native-uuid'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
} from 'react-native-popup-menu';

import { GlobalStyles, Colors, normalizeSize, normalizeWidth, normalizeHeight } from "../utils/GlobalStyles"
import { tags } from "../utils/tags"
import IngredientsInput from "../utils/IngredientsInput"
import DirectionsInput from "../utils/DirectionsInput"

const RecipeEdit = ({ navigation }) => {
    const { recipes, recipeID } = useSelector(state => state.recipeReducer)
    const dispatch = useDispatch()

    const [title, setTitle] = useState('')
    const [recipeTags, setRecipeTags] = useState([])
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null)
    const [ingredients, setIngredients] = useState({ [uuid.v4()]: { amount: '', ingredient: '' } })
    const [directions, setDirections] = useState({ [uuid.v4()]: '' })  
    const [date, setDate] = useState({ day: null, month: null, year: null })
    const [cookTime, setCookTime] = useState({days: null, hours: null, minutes: null}) 
    const [servings, setServings] = useState(null)
    
    const { SlideInMenu } = renderers;
    const [opened, setOpened] = useState(false)

    // effect to load a recipe
    useEffect(() => {
        getRecipe()
    }, [])

    // effect to add a submit button to the header of the stack navigator
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    title='Save'
                    onPress={() => saveRecipe(recipeID)}
                    style={styles.saveButton}
                >
                    <Text style={[GlobalStyles.textMedium, { color: Colors.white }]}>Save Recipe</Text>
                    <MaterialCommunityIcons
                      name='check'
                      size={normalizeSize(25)}
                      color={Colors.white}
                    />
                  </TouchableOpacity>
            )
        })
    })
    
    // looks for a specified recipe from redux and sets state if it exists
    const getRecipe = () => {
        const recipe = recipes.find(recipe => recipe.Id === recipeID)
        if (recipe) {
            setTitle(recipe.Title)
            setRecipeTags(recipe.Tags)
            setDescription(recipe.Description)
            setImage(recipe.Picture)
            setIngredients(recipe.Ingredients)
            setDirections(recipe.Directions)
            setDate(recipe.Date)
            setCookTime(recipe.CookTime)
            setServings(recipe.Servings)
        }
    }

    // saves recipe to redux and to local storage
    const saveRecipe = () => {
        // get current date if recipe is new
        let newDate = date
        if (!(date.day || date.month || date.year)) {
            const today = new Date()
            newDate = { day: today.getDate(), month: today.getMonth(), year: today.getFullYear() }
        }
        // adjust cook time
        let adjustedCookTime = { ...cookTime }
        if (adjustedCookTime.minutes >= 60) {
            const remainingMinutes = adjustedCookTime.minutes % 60
            const extraHours = Math.floor(adjustedCookTime.minutes / 60)
            adjustedCookTime.hours += extraHours
            adjustedCookTime.minutes = remainingMinutes
        }
        if (adjustedCookTime.hours >= 24) {
            const remainingHours = adjustedCookTime.hours % 24
            const extraDays = Math.floor(adjustedCookTime.hours / 24)
            adjustedCookTime.days += extraDays
            adjustedCookTime.hours = remainingHours
        }
        try {
            let Recipe = {
                Id: recipeID,
                Title: title,
                Tags: recipeTags,
                Description: description,
                Picture: image,
                Ingredients: ingredients,
                Directions: directions,
                Date: newDate,
                CookTime: adjustedCookTime,
                Servings: servings          
            }
            const index = recipes.findIndex(recipe => recipe.Id === recipeID)
            let newRecipes = []
            if (index > -1) {
                newRecipes = [...recipes]
                newRecipes[index] = Recipe
            } else {
                newRecipes = [Recipe, ...recipes]
            }
            AsyncStorage.setItem('Recipes', JSON.stringify(newRecipes))
                .then(() => {
                    dispatch(setRecipes(newRecipes))
                    Alert.alert('Success', 'Recipe saved')
                    navigation.goBack()
                })
                .catch(error => console.log(error))
        } catch (error) {
            console.log(error);
        }     
    }

    // uses expo image picker to pick image for the recipe
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if (!result.canceled) { 
            setImage(result.assets[0].uri)
        } 
    }

    const editTags = tag => {
        let tempTags = [...recipeTags]
        const index = tempTags.indexOf(tag)
        if (index > -1) { 
            tempTags.splice(index, 1)
        } else {
            tempTags.push(tag)
        }
        setRecipeTags(tempTags)
    }

    const handleCookTime = (days, hours, minutes) => {
        let newCookTime = {...cookTime}
        if (days) {
            newCookTime.days = days
        }
        if (hours) {
            newCookTime.hours = hours
        }
        if (minutes) {
            newCookTime.minutes = minutes
        }
        setCookTime(newCookTime)
    }

    return (
        <ScrollView style={styles.body} keyboardShouldPersistTaps='handled'> 
            {/* food picture section */}
            <View style={styles.foodImage}>
                {image
                    ? <Image source={{ uri: image }} style={{ width: normalizeWidth(200), height: normalizeWidth(200) }} />
                    : <TouchableOpacity
                        onPress={pickImage}
                        style={styles.pickImageButton}
                    >
                        <MaterialCommunityIcons
                            name={'camera-plus'}
                            size={normalizeSize(70)}
                            color={Colors.grey}
                        />
                    </TouchableOpacity>
                }
            </View>

            {/* Title section */}
            <TextInput
                value={title}
                style={[styles.inputText, styles.recipeTitle, GlobalStyles.textExLarge]} 
                placeholder='Title'
                onChangeText={value => setTitle(value)}
                multiline={true}
            />

            {/* Tags section */}
            {/* display current selected tags */}
            <View style={styles.allTags}>
                {
                    (recipeTags && recipeTags.length !== 0) &&
                        <>
                            {recipeTags.map(tag => (
                                <View key={tag} style={styles.tag}>
                                    <Text style={GlobalStyles.textMedium}>{tag}</Text>
                                    <TouchableOpacity
                                        onPress={() => editTags(tag)}
                                    >
                                        <MaterialCommunityIcons
                                            name='close'
                                            size={normalizeSize(20)}
                                            color={Colors.darkGold}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </>
                }
                {/* tag slide in menu */}
                <Menu
                    renderer={SlideInMenu}
                    opened={opened}
                    onBackdropPress={() => setOpened(false)}
                >
                    <MenuTrigger customStyles={triggerStyles} onPress={() => setOpened(true)}>
                        <Text style={[{color: Colors.white}, , GlobalStyles.textMedium]}>Add Tags</Text>
                        <MaterialCommunityIcons
                            name='plus'
                            size={normalizeSize(20)}
                            color={Colors.white}
                        />
                    </MenuTrigger>
                    <MenuOptions customStyles={optionsStyles}>
                        <MenuOption customStyles={closeOptionStyle} onSelect={() => setOpened(false)} text='Close' />
                        <View style={{width: '100%'}} /> 
                        {tags.map(tag => (
                            <MenuOption
                                key={tag}
                                customStyles={recipeTags.includes(tag) ? selectedOptionStyles : unselectedOptionStyles}
                                onSelect={() => editTags(tag)}
                                text={tag}
                            />
                        ))}
                    </MenuOptions>
                </Menu>    
            </View>
            
            {/* Description section */}
            <TextInput
                value={description}
                style={[styles.inputText, styles.description, GlobalStyles.textMedium]} 
                placeholder='Description'
                onChangeText={value => setDescription(value)}
                multiline={true}
            />

            {/* Servings and cook time */}
            <View style={styles.serveAndTime}>
                <View style={styles.cookTimeContainer}>
                    <Text style={GlobalStyles.textMedium}>Cook Time</Text>
                    <View style={styles.thinLine}/>
                    <View style={styles.cookTime}>
                        <TextInput
                            value={cookTime.days ? String(cookTime.days) : null}
                            style={[styles.inputText, styles.cookTimeInput, GlobalStyles.textMedium]}
                            keyboardType='numeric'
                            placeholder='Days'
                            onChangeText={ value => handleCookTime(Number(value), null, null) }
                        />
                        <Text style={[styles.cookTimeText, GlobalStyles.textSmall]}>d</Text>

                        <TextInput
                            value={cookTime.hours ? String(cookTime.hours) : null}
                            style={[styles.inputText, styles.cookTimeInput, GlobalStyles.textMedium]}
                            keyboardType='numeric'
                            placeholder='Hours'
                            onChangeText={ value => handleCookTime(null, Number(value), null) }
                        />
                        <Text style={[styles.cookTimeText, GlobalStyles.textSmall]}>h</Text>
                        
                        <TextInput
                            value={cookTime.minutes ? String(cookTime.minutes) : null}
                            style={[styles.inputText, styles.cookTimeInput, GlobalStyles.textMedium]}
                            keyboardType='numeric'
                            placeholder='Mins'
                            onChangeText={ value => handleCookTime(null, null, Number(value)) }
                        />
                        <Text style={[styles.cookTimeText, GlobalStyles.textSmall]}>m</Text>
                    </View>
                </View>
                <View style={styles.servingsContainer}>
                    <Text style={GlobalStyles.textMedium}>Servings</Text>
                    <View style={styles.thinLine}/>
                    <TextInput
                        value={servings ? String(servings) : null}
                        style={[styles.inputText, styles.servings, GlobalStyles.textMedium]}
                        keyboardType='numeric'
                        placeholder='Servings'
                        onChangeText={value => setServings(Number(value))}
                    />
                </View>
            </View>

            {/* Ingredients section */}
            <Text style={[GlobalStyles.textLarge, styles.section]}>Ingredients</Text>
            <IngredientsInput ingredients={ingredients} setIngredients={setIngredients} />
            
            {/* Directions section */}
            <Text style={[GlobalStyles.textLarge, styles.section]}>Directions</Text>
            <DirectionsInput directions={directions} setDirections={setDirections} />
        </ScrollView>
    )
}

// styles for the menu trigger for the tags menu
const triggerStyles = {
    triggerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: normalizeHeight(1),
        borderRadius: 15,
        borderColor: Colors.darkGold,
        paddingHorizontal: normalizeWidth(5),
        paddingVertical: normalizeHeight(5),
        marginBottom: normalizeHeight(5),
        marginRight: normalizeWidth(5),
        backgroundColor: Colors.darkGold
    },
}

// styles for the options menu for the tags menu
const optionsStyles = {
    optionsWrapper: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: '100%',
        flexWrap: 'wrap',
        borderTopWidth: normalizeHeight(2),
        borderColor: Colors.gold,
    },
}

// styles for individual unselected tags
const unselectedOptionStyles = {
    optionWrapper: {
        backgroundColor: Colors.white,
        borderWidth: normalizeWidth(1),
        borderRadius: 15,
        borderColor: Colors.darkGold,
        marginVertical: normalizeHeight(5),
        marginHorizontal: normalizeWidth(5),
        paddingVertical: normalizeHeight(7),
        paddingHorizontal: normalizeWidth(7),
    },
    optionText: GlobalStyles.textMedium
}

// styles for individual selected tags
const selectedOptionStyles = {
    optionWrapper: {
        backgroundColor: Colors.darkGold,
        borderWidth: normalizeWidth(1),
        borderRadius: 15,
        borderColor: Colors.darkGold,
        marginVertical: normalizeHeight(5),
        marginHorizontal: normalizeWidth(5),
        paddingVertical: normalizeHeight(7),
        paddingHorizontal: normalizeWidth(7),
    },
    optionText: {
        ...GlobalStyles.textMedium,
        color: Colors.white,
    }
}

// styles for the close option in the tags menu
const closeOptionStyle = {
    optionWrapper: {
        backgroundColor: Colors.darkGold,
        borderWidth: normalizeWidth(1),
        borderRadius: 15,
        borderColor: Colors.darkGold,
        marginVertical: normalizeHeight(5),
        marginHorizontal: normalizeWidth(5),
        paddingVertical: normalizeHeight(7),
        paddingHorizontal: normalizeWidth(7),
        marginLeft: 'auto',
    },
    optionText: {
        ...GlobalStyles.textMedium,
        color: Colors.white
    }
}

export default RecipeEdit

const styles = StyleSheet.create({
    body: {
        flex: 1,
        paddingVertical: normalizeHeight(15),
        paddingHorizontal: normalizeWidth(15),
        backgroundColor: Colors.extraLightGold
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    foodImage: {
        paddingVertical: normalizeHeight(10),
        alignSelf: 'center',
    },
    pickImageButton: {
        width: normalizeWidth(200),
        height: normalizeWidth(200),
        borderColor: Colors.gold,
        borderWidth: normalizeWidth(1),
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: normalizeHeight(10),
    },
    recipeTitle: {
        alignSelf: 'center',
        flexWrap: 'wrap',
        minWidth: '20%',
        maxWidth: '80%',
        textAlign: 'center'
    },
    allTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        maxWidth: '100%'
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: normalizeWidth(1),
        borderRadius: 15,
        borderColor: Colors.gold,
        paddingVertical: normalizeHeight(5),
        paddingHorizontal: normalizeWidth(5),
        marginBottom: normalizeHeight(5),
        marginRight: normalizeWidth(5),
        backgroundColor: Colors.whiteGold
    },
    tagMenu: {
        flexDirection: 'row'
    },
    description: {
        flex: 1,
        flexWrap: 'wrap',
    },
    thinLine: {
        width: '100%',
        borderBottomColor: Colors.gold,
        borderBottomWidth: normalizeWidth(1),
        marginBottom: normalizeHeight(10),
        marginTop: normalizeHeight(2)
    },
    serveAndTime: {
        flexDirection: 'row',
        marginBottom: normalizeHeight(5),
        alignItems: 'center'
    },
    cookTimeContainer: {
        flex: 2,
        alignItems: 'center',
        borderWidth: normalizeWidth(1),
        borderRadius: 5,
        borderColor: Colors.gold,
        backgroundColor: Colors.white,
        paddingVertical: normalizeHeight(10),
        paddingHorizontal: normalizeWidth(10),
        marginRight: normalizeWidth(10),
    },
    cookTime: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    cookTimeInput: {
        flex: 1,
    },
    cookTimeText: {
        marginBottom: normalizeHeight(5),
        marginHorizontal: normalizeWidth(4)
    },
    servingsContainer: {
        flex: 1,
        alignItems: 'center',
        borderWidth: normalizeWidth(1),
        borderRadius: 5,
        borderColor: Colors.gold,
        backgroundColor: Colors.white,
        paddingVertical: normalizeHeight(10),
        paddingHorizontal: normalizeWidth(10),
    },
    servings: {
        width: '75%'
    },
    inputText: {
        borderWidth: normalizeWidth(1),
        borderRadius: 5,
        paddingVertical: normalizeHeight(3),
        paddingHorizontal: normalizeWidth(3),
        marginBottom: normalizeHeight(10),
        borderColor: Colors.gold,
        backgroundColor: Colors.white,
    },
    section: {
        marginBottom: normalizeHeight(20),
        borderBottomColor: Colors.gold,
        borderBottomWidth: normalizeWidth(1),
        paddingBottom: normalizeHeight(5)
    }
})
