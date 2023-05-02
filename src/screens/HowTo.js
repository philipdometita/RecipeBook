import {
    Text,
    StyleSheet,
    Image,
    ScrollView
} from "react-native"

import { GlobalStyles, Colors, normalizeHeight, normalizeWidth } from "../utils/GlobalStyles"

// Component for describing how to use the app
const HowTo = () => {
    return (
        <ScrollView style={styles.body}>
            <Text style={[GlobalStyles.textExLarge, styles.title]}>How to use Recipe Book</Text>
            
            {/* Add recipe instructions */}
            <Text style={[GlobalStyles.textLarge, styles.subTitle]}>Adding a new recipe</Text>

            <Text style={[GlobalStyles.textMedium, styles.paragraph]}>
                To add a new recipe tap the plus / {`\u002B`} button on the bottom right of the main screen
            </Text>
            <Image style={styles.img} source={require('../assets/tutorialImgs/add.png')} />

            <Text style={[GlobalStyles.textMedium, styles.paragraph]}>
                This will bring up the recipe edit screen where you can add the details of your recipe.
            </Text>
            <Image style={styles.img} source={require('../assets/tutorialImgs/createNew.png')} />

            <Text style={[GlobalStyles.textMedium, styles.paragraph]}>
                Tags for your recipe can be added by pressing the Add Tags button
            </Text>
            <Image style={styles.img} source={require('../assets/tutorialImgs/addTags.png')} />

            <Text style={[GlobalStyles.textMedium, styles.paragraph]}>
                This brings up the tags menu where you can select all tags that apply
            </Text>
            <Image style={styles.img} source={require('../assets/tutorialImgs/tagsMenu.png')} />
            
            <Text style={[GlobalStyles.textMedium, styles.paragraph]}>
                after entering all the details of your recipe, tap the save button in the top right of the screen and you are done!
            </Text>
            <Image style={styles.img} source={require('../assets/tutorialImgs/save.png')} />

            {/* Editing section */}
            <Text style={[GlobalStyles.textLarge, styles.subTitle]}>Editing a recipe</Text>

            <Text style={[GlobalStyles.textMedium, styles.paragraph]}>
                To edit an existing recipe, tap on the recipe on the main screen to view it and tap on the edit button on the top right of the screen
            </Text>
            <Image style={styles.img} source={require('../assets/tutorialImgs/edit.png')} />

            <Text style={[GlobalStyles.textMedium, styles.paragraph]}>
                This will bring up the same screen shown when adding a new recipe so that you can edit the details of the recipe.
                Saving the changes is the same as when adding a new recipe, just tap the save button on the top right of the screen.
            </Text>
            
            {/* Delete recipe section */}
            <Text style={[GlobalStyles.textLarge, styles.subTitle]}>Deleting a recipe</Text>

            <Text style={[GlobalStyles.textMedium, styles.paragraph]}>
                To delete a recipe, tap and hold on the recipe on the main screen to bring up the delete option
            </Text>
            <Image style={styles.img} source={require('../assets/tutorialImgs/delete.png')} />

            <Text style={[GlobalStyles.textMedium, styles.paragraph]}>
                After selecting delete, simply confirm the delete and the recipe will be deleted. The recipe cannot be recovered after deleting
                so be sure you want to delete the recipe before confirming
            </Text>
            <Image style={styles.img} source={require('../assets/tutorialImgs/confirmDelete.png')} />

            {/* Filter recipes section */}
            <Text style={[GlobalStyles.textLarge, styles.subTitle]}>Filtering recipes</Text>
            
            <Text style={[GlobalStyles.textMedium, styles.paragraph]}>
                When you start building up recipes, you may want to filter or sort them differently. 
                Currently, recipes will be displayed newest first. To change this tap on the filter button 
                on the bottom left of the main screen.
            </Text>
            <Image style={styles.img} source={require('../assets/tutorialImgs/openFilter.png')} />

            <Text style={[GlobalStyles.textMedium, styles.paragraph]} >
                This will bring up the filter menu where you can sort by date added, cook time or servings made.
                You can also filter recipes by tags. Press the clear filters button on the top left of the menu to reset
                the filters
            </Text>
            <Image style={styles.img} source={require('../assets/tutorialImgs/filter.png')} />
            
            <Text  style={[GlobalStyles.textMedium, styles.paragraph]}>
                If you know what recipe you are looking for, you can use the search bar on the top of the main screen to
                search for a specific recipe
            </Text>
            <Image style={styles.img} source={require('../assets/tutorialImgs/search.png')} />
        </ScrollView>
    )
}

export default HowTo

const styles = StyleSheet.create({
    body: {
        flex: 1,
        paddingVertical: normalizeHeight(10),
        paddingHorizontal: normalizeWidth(10),
        backgroundColor: Colors.extraLightGold,
    },
    title: {
        alignSelf: 'center',
        marginBottom: normalizeHeight(10),
    },
    subTitle: {
        borderBottomColor: Colors.gold,
        borderBottomWidth: normalizeWidth(1),
        paddingBottom: normalizeHeight(5),
        marginVertical: normalizeHeight(10)
    },
    paragraph: {
        marginBottom: normalizeHeight(10),
    },
    img: {
        alignSelf: 'center',
        marginBottom: normalizeHeight(10)
    },
})