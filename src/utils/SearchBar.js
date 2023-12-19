import {
    StyleSheet,
    View,
    TextInput,
    Keyboard,
    TouchableOpacity,
    Text,
    Linking,
    Alert
} from 'react-native';
import { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
} from 'react-native-popup-menu';

import { GlobalStyles, Colors, normalizeHeight, normalizeWidth, normalizeSize } from "./GlobalStyles"

/**
 * Search bar component for the AllRecipes screen'
 * based on tutorial by Kevin Tomas https://blog.logrocket.com/create-react-native-search-bar-from-scratch/
 * @param {object} props object containing props passed to the component 
 * @param {string} props.search state from parent containing search phrase
 * @param {(string) => void} props.setSearch callback to state function to set search phrase
 * @param {object} props.navigation prop provided by stack navigator to access convenience functions for navigation actions
 * @returns void
 */
const SearchBar = ({ search, setSearch, navigation }) => {
    // state for tracking if the search bar is focused on
    const [sbFocused, setSbFocused] = useState(false)

    // renderer for the pop up menu
    const { Popover } = renderers;

    // open url to site
    // url: url of website to be opened
    const openUrl = url => {
        Linking.openURL(url).catch(err => Alert.alert("Couldn't load page", err))
    }

    return (
        <View style={styles.container}>
            <View style={ sbFocused ? styles.searchBarFocused : styles.searchBarUnfocused }>
                <Ionicons
                    name='search-outline'
                    size={normalizeSize(20)}
                    color={Colors.darkGold}
                />
                <TextInput
                    style={[GlobalStyles.textLarge, styles.input]}
                    placeholder='Search for Recipes'
                    value={search}
                    onChangeText={setSearch}
                    onFocus={() => setSbFocused(true)}
                />
                {
                    sbFocused && (
                        <Ionicons
                            name='close'
                            size={normalizeSize(20)}
                            color={Colors.darkGold}
                            onPress={() => setSearch('')}
                        />
                    )
                }
            </View>
            {/* conditionally render a close button or three dots menu depending on if the bar is in focus */}
            {
                sbFocused ? (
                    <View>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                Keyboard.dismiss()
                                setSbFocused(false)
                            }}
                        >
                            <Text style={[GlobalStyles.textLarge, {color: Colors.white}]}>Close</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.dotsMenu}>
                        <Menu
                            renderer={Popover}
                            rendererProps={{placement: 'bottom', preferredPlacement: 'bottom'}}
                        >
                            <MenuTrigger>
                                <MaterialCommunityIcons
                                    name='dots-vertical'
                                    size={normalizeSize(30)}
                                    color={Colors.white}
                                />        
                            </MenuTrigger> 
                            <MenuOptions customStyles={optionsStyles}>
                                <MenuOption onSelect={() => navigation.navigate('HowTo')}>
                                    <Text style={GlobalStyles.textMedium}>How to Use</Text>
                                </MenuOption>    
                                <MenuOption onSelect={() => navigation.navigate('About')}>
                                    <Text style={GlobalStyles.textMedium}>About this App</Text>
                                </MenuOption>
                                <MenuOption onSelect={() => openUrl("https://github.com/philipdometita/RecipeBook")}>
                                    <Text style={GlobalStyles.textMedium}>Github Page</Text>
                                </MenuOption>
                            </MenuOptions>    
                        </Menu>
                    </View>
                )
            }
        </View>
    )
}

export default SearchBar

const optionsStyles = {
    optionsWrapper: {
        paddingRight: normalizeWidth(20),
        paddingVertical: normalizeHeight(10)
    },
}

const styles = StyleSheet.create({
    container: {
        marginVertical: normalizeHeight(20),
        marginHorizontal: normalizeWidth(20),
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        width: '90%'
    },
    searchBarFocused: {
        paddingHorizontal: normalizeWidth(10),
        paddingVertical: normalizeHeight(10),
        flexDirection: 'row',
        width: '80%',
        backgroundColor: Colors.extraLightGold,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    searchBarUnfocused: {
        paddingHorizontal: normalizeWidth(10),
        paddingVertical: normalizeHeight(10),
        flexDirection: 'row',
        width: '80%',
        backgroundColor: Colors.extraLightGold,
        borderRadius: 10,
        alignItems: 'center',
    },
    input: {
        marginLeft: normalizeWidth(10),
        width: '90%'
    },
    closeButton: {
        paddingHorizontal: normalizeWidth(10),
        paddingVertical: normalizeHeight(10),
        marginLeft: normalizeWidth(5)
    },
    dotsMenu: {
        paddingHorizontal: normalizeWidth(15)
    },
})
