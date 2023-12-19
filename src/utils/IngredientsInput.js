import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import uuid from 'react-native-uuid'

import { GlobalStyles, Colors, normalizeSize, normalizeWidth, normalizeHeight } from "./GlobalStyles"
import { useRef, useLayoutEffect, useState } from "react"

/**
 * Component for inputing ingredients and their amounts on the recipe edit screen
 * @param {object} props object containing props passed to component
 * @param {object} props.ingredients object containing ingredients for recipe
 * @param {object} props.ingredients.ingredientID key for ingredient 
 * @param {string} props.ingredients.ingredientID.amount amount of ingredient 
 * @param {string} props.ingredients.ingredientID.ingredient type of ingredient 
 * @param {(object) => void} props.setIngredients callback to state function to set ingredients   
 * @returns void
 */
const IngredientsInput = ({ ingredients, setIngredients }) => {

    // refs to focus on newest input
    let inputRef = useRef(null)
    
    // state to track if ref should be focused on
    const [triggerEff, setTriggerEff] = useState(false)

    // change focus to new input
    useLayoutEffect(() => {
        if (inputRef.current && triggerEff) {
            setTimeout(() => inputRef.current.focus(), 100) // keyboard not appearing without timeout
        }    
    }, [ingredients])

    // add ingredient on button press
    const addIngredient = () => {
        const newIngr = { ...ingredients, [uuid.v4()]: { amount: '', ingredient: '' } }
        setTriggerEff(true)
        setIngredients(newIngr)
    }

    // delete ingredient on button press
    // key: key of the ingredient to delete
    const deleteIngredient = key => {
        const newIngr = Object.fromEntries(Object.entries(ingredients).filter(([arrKey]) => !arrKey.includes(key)))
        setTriggerEff(false)
        setIngredients(newIngr)
    }

    // handles on change for ingredient inputs
    // key: key of ingredient to change
    // amount: amount of ingredient (null if not changing amount)
    // amount: type of ingredient (null if not changing ingredient)
    const ingrOnChange = (key, amount, ingredient) => {
        let ingrObj = JSON.parse(JSON.stringify(ingredients))
        if (amount !== null) {
            ingrObj[key].amount = amount
        } else if (ingredient !== null) {
            ingrObj[key].ingredient = ingredient
        }
        setIngredients(ingrObj)
        setTriggerEff(false)
    }

    return (
        <View>
            {
                Object.entries(ingredients).map(([key, item]) => (
                    <View style={styles.ingredients} key={key}>
                        <Text style={[styles.bullet, GlobalStyles.textMedium]}>{`\u2022`}</Text>
                        <TextInput
                            value={item.amount}
                            style={[styles.inputText, styles.inputAmount, GlobalStyles.textMedium]}
                            placeholder='amount'
                            ref={inputRef}
                            onChangeText={amount => ingrOnChange(key, amount, null)}
                            multiline={true}
                        />
                        <TextInput
                            value={item.ingredient}
                            style={[styles.inputText, styles.inputIngredient, GlobalStyles.textMedium]}
                            placeholder='ingredient'
                            onChangeText={ingredient => ingrOnChange(key, null, ingredient)}
                            multiline={true}
                        />
                        <TouchableOpacity
                            onPress={() => deleteIngredient(key)}
                            style={styles.deleteIngredientButton}
                        >
                            <MaterialCommunityIcons
                                name={'close-box'}
                                size={normalizeSize(30)}
                                color={Colors.darkGold}
                            />
                        </TouchableOpacity>
                    </View>
                ))
            }
            <TouchableOpacity
                style={styles.addButton}
                onPress={addIngredient}
            >
                <MaterialCommunityIcons
                    name={'plus'}
                    size={normalizeSize(30)}
                    color={Colors.gold}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    inputText: {
        borderWidth: normalizeWidth(1),
        borderRadius: 5,
        paddingVertical: normalizeHeight(3),
        paddingHorizontal: normalizeWidth(3),
        marginBottom: normalizeHeight(10),
        borderColor: Colors.gold,
        backgroundColor: Colors.white,
    },
    ingredients: {
        flexDirection: 'row',
    },
    bullet: {
        marginTop: normalizeHeight(5),
        marginRight: normalizeWidth(5),
    },
    inputAmount: {
        flex: 4,
        marginRight: normalizeWidth(4)
    },
    inputIngredient: {
        flex: 15
    },
    deleteIngredientButton: {
        flex: 2,
        alignSelf: 'center',
        marginBottom: normalizeHeight(10),
    },
    addButton: {
        width: '80%',
        alignSelf: 'center',
        borderWidth: normalizeWidth(1),
        borderRadius: 5,
        borderColor: Colors.gold,
        backgroundColor: Colors.white,
        alignItems: 'center',
        marginBottom: normalizeHeight(10)
    },
})

export default IngredientsInput