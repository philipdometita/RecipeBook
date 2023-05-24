import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity
} from "react-native";
import { useEffect, useState } from "react"
import uuid from 'react-native-uuid'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { useDispatch, useSelector } from 'react-redux'
import { setRecipeID } from '../redux/actions'

import { GlobalStyles, Colors, normalizeHeight, normalizeWidth, normalizeSize } from "../utils/GlobalStyles"

const Recipe = ({ navigation }) => {
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

    const months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    // effect to load a recipe
    useEffect(() => {
        getRecipe()
    }, [recipes])
    
     // effect to add a submit button to the header of the stack navigator
     useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    title='Edit'
                    onPress={() => editRecipe(recipeID)}
                    style={styles.editButton}
                >
                    <Text style={[GlobalStyles.textMedium, {color: Colors.white}]}>Edit Recipe</Text>
                    <MaterialCommunityIcons
                      name='pencil-outline'
                      size={normalizeSize(25)}
                      color={Colors.white}
                    />
                  </TouchableOpacity>
            )
        })
    })

    // load recipe details into state
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

    // go to recipe edit screen
    // only used when creating new recipe 
    // id: id of recipe to edit (new id is given when creating new recipe)
    const editRecipe = (id) => {
        dispatch(setRecipeID(id))
        navigation.navigate("RecipeEdit")
    }

    return (
        <ScrollView style={styles.body}>
            <Text style={[GlobalStyles.textSmall, styles.date]}>{`Recipe added: ${date.day} ${months[date.month]} ${date.year}` }</Text>
            {/* picture section */}
            <View style={ styles.foodImage }>
            {image
                // image component if recipe has picture saved
                ? <Image
                    style={styles.imageStyle}
                    source={{uri: image}}
                  />
                // default image if no image is provided for the recipe
                : <Image
                    style={styles.imageStyle}
                    source={require('../assets/forkAndSpoon.png')}
                    tintColor={Colors.gold}
                  />
            } 
            </View>

            {/* title, description and tags */}
            <Text style={[GlobalStyles.textExLarge, styles.recipeTitle]}>{title}</Text>

            <View style={styles.allTags}>
                {
                    (recipeTags && recipeTags.length !== 0) &&
                        <>
                            {recipeTags.map(tag => (
                                <View key={tag} style={styles.tag}>
                                    <Text style={GlobalStyles.textMedium}>{tag}</Text>
                                </View>
                            ))}
                        </>
                }
            </View>

            <Text style={[GlobalStyles.textMedium, styles.description]}>{description}</Text>
            
            {/* Cook time and servings made section */}
            <View style={styles.serveAndTime}>
                <View style={styles.cookTimeContainer}>
                    <Text style={GlobalStyles.textMedium}>Cook Time</Text>
                    <View style={styles.thinLine}/>
                    <View style={styles.cookTime}>
                        {/* conditionally render if cook time is provided and conditionally render plural words if necessary */}
                        {cookTime.days && 
                            <>
                                <Text style={GlobalStyles.textMedium}>{cookTime.days}</Text>
                                <Text style={[GlobalStyles.textMedium, styles.cookTimeText]}>{cookTime.days === 1 ? 'Day' : 'Days'}</Text>
                            </>
                        }
                        {cookTime.hours && 
                            <>
                                <Text style={GlobalStyles.textMedium}>{cookTime.hours}</Text>
                                <Text style={[GlobalStyles.textMedium, styles.cookTimeText]}>{cookTime.hours === 1 ? 'Hour' : 'Hours'}</Text>
                            </>
                        }
                        {cookTime.minutes && 
                            <>
                                <Text style={GlobalStyles.textMedium}>{cookTime.minutes}</Text>
                                <Text style={[GlobalStyles.textMedium, styles.cookTimeText]}>{cookTime.minutes === 1 ? 'Min' : 'Mins'}</Text>
                            </>
                        }
                    </View>
                </View>    
                <View style={styles.servingsContainer}>
                    <Text style={GlobalStyles.textMedium}>Servings</Text>
                    <View style={styles.thinLine}/>
                    <Text style={GlobalStyles.textMedium}>{servings}</Text>
                </View>
            </View>

            {/* ingredients */}
            <Text style={[GlobalStyles.textLarge, styles.section]}>Ingredients</Text>
            <View style={styles.allIngredients}>
            {
                Object.entries(ingredients).map(([key, item]) => (
                    <View style={styles.ingredientLine} key={key}>
                        <Text style={styles.bullet}>{`\u2022`}</Text>
                        <Text style={[GlobalStyles.textMedium, styles.amount]}>{item.amount}</Text>
                        <Text style={[GlobalStyles.textMedium, styles.ingredient]}>{item.ingredient}</Text>
                    </View>
                ))
            }
            </View>

            {/* directions */}
            <Text style={[GlobalStyles.textLarge, styles.section]}>Directions</Text>
            <View style={styles.allDirections}>
            {
                Object.entries(directions).map(([key, item], index) => (
                    <View style={styles.directionLine} key={key}>
                        <Text style={ styles.listNum }>{ `${index + 1}.`}</Text>
                        <Text style={[GlobalStyles.textMedium, styles.direction]}>{item}</Text>
                    </View>
                ))
            }
            </View>
        </ScrollView>
    )
}

export default Recipe

const styles = StyleSheet.create({
    body: {
        flex: 1,
        paddingVertical: normalizeHeight(15),
        paddingHorizontal: normalizeWidth(15),
        backgroundColor: Colors.extraLightGold
    },
    imageStyle: {
        width: normalizeWidth(200),
        height: normalizeWidth(200)
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    date: {
        alignSelf: 'flex-end',
        color: Colors.grey
    },
    foodImage: {
        marginVertical: normalizeHeight(10),
        alignSelf: 'center'
    },
    recipeTitle: {
        alignSelf: 'center',
        flexWrap: 'wrap',
        maxWidth: '80%',
        marginBottom: normalizeHeight(10),
    },
    allTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        maxWidth: '100%',
        justifyContent: 'center'
    },
    tag: {
        flexDirection: 'row',
        borderWidth: normalizeWidth(1),
        borderRadius: 15,
        borderColor: Colors.gold,
        paddingVertical: normalizeHeight(5),
        paddingHorizontal: normalizeWidth(5),
        marginBottom: normalizeHeight(5),
        marginRight: normalizeWidth(5),
        backgroundColor: Colors.whiteGold
    },
    description: {
        flex: 1,
        flexWrap: 'wrap',
        marginBottom: normalizeHeight(15),
        marginTop: normalizeHeight(10)
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
        marginBottom: normalizeHeight(10),
        alignItems: 'center'
    },
    cookTimeContainer: {
        flex: 2,
        alignItems: 'center',
        borderWidth: normalizeWidth(1),
        borderRadius: 5,
        borderColor: Colors.gold,
        paddingVertical: normalizeHeight(10),
        paddingHorizontal: normalizeWidth(10),
        marginRight: normalizeWidth(10),
    },
    cookTime: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    cookTimeText: {
        marginRight: normalizeWidth(10),
        marginLeft: normalizeWidth(5)
    },
    servingsContainer: {
        flex: 1,
        alignItems: 'center',
        borderWidth: normalizeWidth(1),
        borderRadius: 5,
        borderColor: Colors.gold,
        paddingVertical: normalizeHeight(10),
        paddingHorizontal: normalizeWidth(10),
    },
    section: {
        marginBottom: normalizeHeight(20),
        borderBottomColor: Colors.gold,
        borderBottomWidth: normalizeWidth(1),
        paddingBottom: normalizeHeight(5)
    },
    allIngredients: { 
        marginBottom: normalizeHeight(5)
    },
    bullet: {
        marginBottom: normalizeHeight(10),
        marginRight: normalizeWidth(5),
    },
    ingredientLine: {
        flexDirection: 'row',
        marginBottom: normalizeHeight(3)
    },  
    amount: {
        flex: 3
    },
    ingredient: {
        flex: 15
    },
    allDirections: {
        marginBottom:  normalizeHeight(20)
    },
    directionLine: {
        flexDirection: 'row',
        marginBottom: normalizeHeight(7)
    },
    listNum: {
        flex: 1
    },
    direction: {
        flex: 9
    },
})
