/**
 * file containing styles and size normalizing functions used around the app
 */
import {
    StyleSheet,
    Dimensions,
    PixelRatio
} from "react-native"

// normalize sizes for different sized viewports
const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
} = Dimensions.get('window')

// scale based on viewport size of Google Pixel 4
const widthBaseScale = SCREEN_WIDTH / 393
const heightBaseScale = SCREEN_HEIGHT / 830

const normalize = (size, based = 'width') => {
    const newSize = (based === 'height') ? size * heightBaseScale : size * widthBaseScale
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
}

export const normalizeSize = size => {
    return normalize(size, 'height')
}

export const normalizeHeight = size => {
    return normalize(size, 'height')
}

export const normalizeWidth = size => {
    return normalize(size, 'width')
}
    

const fontFamily = 'RobotoSlab'
// might be able to implement font size settings and dark mode settings with conditionals in here. (might need to edit redux to have access)
// control font sizes and font family in one place to update easier  
export const GlobalStyles = StyleSheet.create({
    textExSmall: {
        fontSize: normalize(10, 'height'),
        fontFamily: fontFamily
    },
    textSmall: {
        fontSize: normalize(12, 'height'),
        fontFamily: fontFamily
    },
    textMedium: {
        fontSize: normalize(15, 'height'),
        fontFamily: fontFamily
    },
    textLarge: {
        fontSize: normalize(20, 'height'),
        fontFamily: fontFamily
    },
    textExLarge: {
        fontSize: normalize(25, 'height'),
        fontFamily: fontFamily
    }
})

// colour platte used throughout the app
export const Colors = {
    whiteGold: '#F7EEE2',
    extraLightGold: '#F2E4CE',
    lightGold: '#E5CBA1',
    gold: '#C1933E',
    darkGold: '#8D6426',
    extraDarkGold: '#463213',
    blackGold: '#191206',
    grey: '#AAAAAA',
    lightGrey: '#DEDEDE',
    white: '#FFFFFF',
}