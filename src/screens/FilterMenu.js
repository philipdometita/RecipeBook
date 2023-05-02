import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useState } from 'react';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
} from 'react-native-popup-menu';

import { Colors, GlobalStyles, normalizeHeight, normalizeSize, normalizeWidth } from "../utils/GlobalStyles"
import { tags } from "../utils/tags"

// component for displaying menu containing filter options
// primaryFilter: primaryFilter state from parent
// setPrimaryFilter: setter for primaryFilter state
// tagFilter: tagFilter state from parent
// setTagFilter: setter for tagFilter state
const FilterMenu = ({ primaryFilter, setPrimaryFilter, tagFilter, setTagFilter}) => {

    // state to control if menu is open or not
    const [opened, setOpened] = useState(false)

    //set up renderer for react-native-popup-menu
    const { SlideInMenu } = renderers;

    // clears selected filters
    const cancelFilters = () => {
        setOpened(false)
        setPrimaryFilter('earlyLast')
        setTagFilter([])
    }
    
    // handles primary filter toggle selection
    const handlePrimaryFilters = filterType => {
        if (filterType === 'early') {
            if ((primaryFilter === 'earlyFirst') || !primaryFilter.includes(filterType)) {
                setPrimaryFilter('earlyLast')
            } else if (primaryFilter === 'earlyLast') {
                setPrimaryFilter('earlyFirst')
            }
        } else if (filterType === 'cookTime') {
            if ((primaryFilter === 'cookTimeHigh') || !primaryFilter.includes(filterType)) {
                setPrimaryFilter('cookTimeLow')
            } else if (primaryFilter === 'cookTimeLow') {
                setPrimaryFilter('cookTimeHigh')
            }
        } else if (filterType === 'servings') {
            if ((primaryFilter === 'servingsLow') || !primaryFilter.includes(filterType)) {
                setPrimaryFilter('servingsHigh')
            } else if (primaryFilter === 'servingsHigh') {
                setPrimaryFilter('servingsLow')
            }
        }
    }

    // adds or removes tags from filter 
    const handleTagFilters = tag => {
        let tempFilterTags = [...tagFilter]
        const index = tempFilterTags.indexOf(tag)
        if (index > -1) {
            tempFilterTags.splice(index, 1) 
        } else {
            tempFilterTags.push(tag)
        }
        setTagFilter(tempFilterTags)
    }

    // icon for descending sort for primary filter
    const menuDownArrow = (
        <MaterialCommunityIcons
            name={'menu-down'}
            size={normalizeSize(20)}
            color={Colors.white}
        />
    )
    
    // icon for ascending sort for primary filter
    const menuUpArrow = (
        <MaterialCommunityIcons
            name={'menu-up'}
            size={normalizeSize(20)}
            color={Colors.white}
        />
    )

    // icon for unselected primary filter
    const menuSwapArrows = (
        <MaterialCommunityIcons
            name={'menu-swap'}
            size={normalizeSize(20)}
            color={Colors.darkGold}
        />
    )

    return (
        <Menu
            renderer={SlideInMenu}
            opened={opened}
            onBackdropPress={() => setOpened(false)}
        >
            <MenuTrigger onPress={() => setOpened(true)}>
                <View
                    style={styles.filterButton}
                >
                    <MaterialCommunityIcons 
                        name={'filter-variant'}
                        size={normalizeSize(25)}
                        color={Colors.white}
                    />
                </View>
            </MenuTrigger>
            <MenuOptions customStyles={optionsStyles}>
                <MenuOption customStyles={cancelOptionStyle} onSelect={cancelFilters} text='Clear Filters' />
                <MenuOption customStyles={closeOptionStyle} onSelect={() => setOpened(false)} text='Close' />
                <View style={{ width: '100%' }} />
                <View style={styles.primaryFilters}>
                    {/* option to sort by date added */}
                    <MenuOption
                        onSelect={() => handlePrimaryFilters('early')}
                        customStyles={ primaryFilter.includes('early') ? selectedFilterOption : unselectedFilterOption}
                    >
                        <Text style={primaryFilter.includes('early') ? styles.whiteText : GlobalStyles.textMedium}>
                            Date added
                        </Text>
                        {(primaryFilter === 'earlyLast') && menuDownArrow}
                        {(primaryFilter === 'earlyFirst') && menuUpArrow}
                        {(primaryFilter !== ('earlyLast') && primaryFilter !== ('earlyFirst')) && menuSwapArrows}
                    </MenuOption>

                    {/* option to sort by total cook time */}
                    <MenuOption
                        onSelect={() => handlePrimaryFilters('cookTime')}
                        customStyles={ primaryFilter.includes('cookTime') ? selectedFilterOption : unselectedFilterOption}
                    >
                        <Text style={primaryFilter.includes('cookTime') ? styles.whiteText : GlobalStyles.textMedium}>
                            Cook Time
                        </Text>
                        {(primaryFilter === 'cookTimeHigh') && menuDownArrow}
                        {(primaryFilter === 'cookTimeLow') && menuUpArrow}
                        {(primaryFilter !== ('cookTimeHigh') && primaryFilter !== ('cookTimeLow')) && menuSwapArrows}
                    </MenuOption>

                    {/* option to sort by amount of servings made */}
                    <MenuOption
                        onSelect={() => handlePrimaryFilters('servings')}
                        customStyles={ primaryFilter.includes('servings') ? selectedFilterOption : unselectedFilterOption}
                    >
                        <Text style={primaryFilter.includes('servings') ? styles.whiteText : GlobalStyles.textMedium}>
                            Servings
                        </Text>
                        {(primaryFilter === 'servingsHigh') && menuDownArrow}
                        {(primaryFilter === 'servingsLow') && menuUpArrow}
                        {(primaryFilter !== ('servingsHigh') && primaryFilter !== ('servingsLow')) && menuSwapArrows}
                    </MenuOption>
                </View>

                <View style={styles.thinLine} />

                {/* tag selection section */}
                {/* good area for optimization */}
                <View style={styles.tags}>
                    {tags.map(tag => (
                        <MenuOption
                            customStyles={tagFilter.includes(tag) ? selectedTag : unselectedTag}
                            text={tag}
                            onSelect={() => handleTagFilters(tag)}
                            key={tag}
                        />
                    ))}
                </View>
            </MenuOptions>
        </Menu>
    )
}

export default FilterMenu

// styles for the menu
const optionsStyles = {
    optionsWrapper: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: '100%',
        flexWrap: 'wrap',
        borderTopWidth: normalizeWidth(2),
        borderColor: Colors.gold,
    },
}

// styles for the clear option in the sort menu
const cancelOptionStyle = {
    optionWrapper: {
        backgroundColor: Colors.darkGold,
        borderWidth: normalizeWidth(1),
        borderRadius: 15,
        borderColor: Colors.darkGold,
        marginVertical: normalizeHeight(5),
        marginHorizontal: normalizeWidth(5),
        paddingVertical: normalizeHeight(4),
        paddingHorizontal: normalizeWidth(4)
    },
    optionText: {
        ...GlobalStyles.textMedium,
        color: Colors.white,
    }
}

// styles for the close button on the menu
const closeOptionStyle = {
    optionWrapper: {
        backgroundColor: Colors.darkGold,
        borderWidth: normalizeWidth(1),
        borderRadius: 15,
        borderColor: Colors.darkGold,
        marginVertical: normalizeHeight(5),
        marginHorizontal: normalizeWidth(5),
        paddingVertical: normalizeHeight(4),
        paddingHorizontal: normalizeWidth(4),
        marginLeft: 'auto'
    },
    optionText: {
        ...GlobalStyles.textMedium,
        color: Colors.white,
    }
}

// styles for the unselected primary filters
const unselectedFilterOption = {
    optionWrapper: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderWidth: normalizeWidth(1),
        borderRadius: 15,
        borderColor: Colors.darkGold,
        marginVertical: normalizeHeight(5),
        marginHorizontal: normalizeWidth(5),
        paddingVertical: normalizeHeight(4),
        paddingHorizontal: normalizeWidth(4)
    }
}

// styles for the selected primary filters
const selectedFilterOption = {
    optionWrapper: {
        flexDirection: 'row',
        backgroundColor: Colors.darkGold,
        borderWidth: normalizeWidth(1),
        borderRadius: 15,
        borderColor: Colors.darkGold,
        marginVertical: normalizeHeight(5),
        marginHorizontal: normalizeWidth(5),
        paddingVertical: normalizeHeight(4),
        paddingHorizontal: normalizeWidth(4)
    }
}

// styles for the unselected tags
const unselectedTag = {
    optionWrapper: {
        backgroundColor: Colors.white,
        borderWidth: normalizeWidth(1),
        borderRadius: 15,
        borderColor: Colors.darkGold,
        marginVertical: normalizeHeight(5),
        marginHorizontal: normalizeWidth(5),
        paddingVertical: normalizeHeight(4),
        paddingHorizontal: normalizeWidth(4)
    },
    optionText: {
        ...GlobalStyles.textMedium,
    }
}

// styles for the selected tags
const selectedTag = {
    optionWrapper: {
        backgroundColor: Colors.darkGold,
        borderWidth: normalizeWidth(1),
        borderRadius: 15,
        borderColor: Colors.darkGold,
        marginVertical: normalizeHeight(5),
        marginHorizontal: normalizeWidth(5),
        paddingVertical: normalizeHeight(4),
        paddingHorizontal: normalizeWidth(4)
    },
    optionText: {
        ...GlobalStyles.textMedium,
        color: Colors.white
    }
}

const styles = StyleSheet.create({
    filterButton: {
        width: normalizeWidth(50),
        height: normalizeWidth(50),
        borderRadius: 50,
        backgroundColor: Colors.darkGold,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: normalizeHeight(10),
        left: normalizeWidth(10),
        elevation: 5,
    },
    primaryFilters: {
        flexDirection: 'row'
    },
    thinLine: {
        width: '100%',
        borderBottomColor: Colors.gold,
        borderBottomWidth: normalizeWidth(1),
        marginBottom: normalizeHeight(10),
        marginTop: normalizeHeight(2)
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        maxWidth: '95%'
    },
    whiteText: {
        ...GlobalStyles.textMedium,
        color: Colors.white
    },
})

