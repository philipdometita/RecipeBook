import {
    View,
    StyleSheet,
    Image,
    Text,
    Alert,
    ScrollView
} from "react-native"
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
} from 'react-native-popup-menu'
import { useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { GlobalStyles, Colors, normalizeHeight, normalizeWidth, normalizeSize } from "./GlobalStyles"

// component for rendering recipe card on AllRecipes screen
// recipe: recipe to be rendered
// width: width of device screen
// height: height of device screen
const Card = ({ recipe, width, deleteRecipe, goToRecipe}) => {
    let thumbWidth = (width / 2.3)

    // months array to display month string instead of number
    const months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    const imageStyle = { width: thumbWidth, height: thumbWidth }

    // margin for popover to appear at bottom of card
    const [popOverMargin, setPopOverMargin] = useState(0)

    // set up renderer for react-native-popup-menu
    const { Popover } = renderers;

    // confirmation menu for deleting a recipe
    // id: id of recipe to delete
    // recipeName: name of recipe to be deleted
    const confirmDelete = (id, recipeName) => {
        Alert.alert('Are you sure?', `Delete recipe: ${recipeName}?`, [
            {
                text: 'Cancel',
            },
            {
                text: 'Delete Recipe',
                onPress: () => deleteRecipe(id)
            }
        ])
    }

    return (
        <View
            style={[styles.card, { width: thumbWidth }]}
            onLayout={event => {
                const { height } = event.nativeEvent.layout
                setPopOverMargin(height - thumbWidth) // calculate margintop for popover
            }}
        >
            <Menu
                renderer={Popover}
                rendererProps={{ preferredPlacement: 'bottom', anchorStyle: { backgroundColor: Colors.gold, marginTop: popOverMargin } }}
            >
                <MenuTrigger triggerOnLongPress={true} onAlternativeAction={() => goToRecipe(recipe.Id)}>
                    {recipe.Picture
                        // image component if recipe has picture saved
                        ? <Image
                            style={imageStyle}
                            source={{uri: recipe.Picture}}
                        />
                        // default image if no image is provided for the recipe
                        : <Image
                            style={imageStyle}
                            source={require('../assets/forkAndSpoon.png')}
                            tintColor={Colors.gold}
                        />
                    }
                </MenuTrigger>
                {/* delete recipe popover menu option */}
                <MenuOptions style={ styles.popOver }>
                    <MenuOption style={styles.deleteOption} onSelect={() => confirmDelete(recipe.Id, recipe.Title)}>
                    <Text style={[styles.deleteText, GlobalStyles.textMedium]}>Delete Recipe</Text>
                        <MaterialCommunityIcons
                            name={'trash-can-outline'}
                            size={normalizeSize(20)}
                            color={'red'}
                        />
                    </MenuOption>
                </MenuOptions>
            </Menu>
            <View style={styles.thinLine} />
            <Text style={[GlobalStyles.textMedium, styles.cardText, { width: thumbWidth }]}>{recipe.Title}</Text>
            <ScrollView horizontal={true} style={styles.allTags}>
                {
                    (recipe.Tags && recipe.Tags.length !== 0) &&
                        <>
                            {recipe.Tags.map(tag => (
                                <View key={tag} style={styles.tag}>
                                    <Text style={GlobalStyles.textSmall}>{tag}</Text>
                                </View>
                            ))}
                        </>
                }
            </ScrollView>
            <Text style={[styles.cardText, GlobalStyles.textSmall]}>{`${recipe.Date.day} ${months[recipe.Date.month]} ${recipe.Date.year}` }</Text>
        </View>
    )
}

export default Card

const styles = StyleSheet.create({
    card: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        borderColor: Colors.gold,
        borderRadius: 15,
        borderWidth: normalizeWidth(2),
        overflow: 'hidden',
        zIndex: 1,
    },
    cardText: {
        textAlign: "center",
    },
    thinLine: {
        width: '85%',
        borderBottomColor: Colors.gold,
        borderBottomWidth: normalizeWidth(1),
        marginTop: normalizeHeight(5)
    },
    allTags: {
        flexDirection: 'row',
        overflow: "hidden",
        maxWidth: '100%',
        paddingTop: normalizeHeight(2),
        paddingBottom: normalizeHeight(5),
        zIndex: 2,
        elevation: 2
    },
    tag: {
        flexDirection: 'row',
        borderWidth: normalizeWidth(1),
        borderRadius: 15,
        borderColor: Colors.gold,
        paddingHorizontal: normalizeWidth(3),
        paddingVertical: normalizeHeight(3),
        marginBottom: normalizeHeight(2),
        marginRight: normalizeWidth(5),
        backgroundColor: Colors.whiteGold
    },
    popOver: {
        borderWidth: normalizeWidth(1.5),
        borderColor: Colors.gold,
        paddingHorizontal: normalizeWidth(15),
        paddingVertical: normalizeHeight(10)
    },
    deleteOption: {
        flexDirection: 'row',
    },
    deleteText: {
        color: 'red',
        marginRight: normalizeWidth(5),
        fontWeight: 'bold'
    }
})

