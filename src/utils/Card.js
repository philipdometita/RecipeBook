import {
    View,
    StyleSheet,
    Image,
    Text,
} from "react-native"
import { GlobalStyles, Colors, normalizeHeight, normalizeWidth } from "./GlobalStyles"

// component for rendering recipe card on AllRecipes screen
// recipe: recipe to be rendered
// width: width of device screen
// height: height of device screen
const Card = ({ recipe, width, height }) => {
    let thumbWidth = (width / 2.3)

    // months array to display month string instead of number
    const months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    const imageStyle = { width: thumbWidth, height: thumbWidth }

    return (
        <View style={[styles.card, {width: thumbWidth}]}>
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
            <View style={styles.thinLine} />
            <Text style={[GlobalStyles.textMedium, styles.cardText, { width: thumbWidth }]}>{recipe.Title}</Text>
            <View horizontal={true} style={styles.allTags}>
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
            </View>
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
})

