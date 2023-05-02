import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import uuid from 'react-native-uuid'

import { GlobalStyles, Colors, normalizeSize, normalizeWidth, normalizeHeight } from "./GlobalStyles"
import { useRef, useLayoutEffect, useState } from "react"

// component for rendering list of directions
// directions: directions state from parent (RecipeEdit)
// setDirections: state setter for directions from parent (RecipeEdit)
const DirectionsInput = ({ directions, setDirections }) => {
     // refs to focus on newest input
     let inputRef = useRef(null)
    
     // state to track if ref should be focused on
     const [triggerEff, setTriggerEff] = useState(false)
 
     // change focus to new input
     useLayoutEffect(() => {
         if (inputRef.current && triggerEff) {
             setTimeout(() => inputRef.current.focus(), 100) // keyboard not appearing without timeout
         }    
     }, [directions])
    
    // add direction after button press
    const addDirection = () => {
        const newDirec = { ...directions, [uuid.v4()]: '' }
        setTriggerEff(true)
        setDirections(newDirec)
    }

    // delete direction after button press
    // key: key of direction to delete
    const deleteDirection = key => {
        const newDirec = Object.fromEntries(Object.entries(directions).filter(([arrKey]) => !arrKey.includes(key)))
        setTriggerEff(false)
        setDirections(newDirec)
    }

    // handle on change for direction inputs
    // key: key of direction to change
    // direction: value to change direction to
    const direcOnChange = (key, direction) => {
        let direcObj = { ...directions }
        direcObj[key] = direction
        setTriggerEff(false)
        setDirections(direcObj)
    }

    return (
        <View>
            {     
                Object.entries(directions).map(([key, item], index) => (
                    <View style={styles.directions} key={key}>
                        <Text style={[styles.listNum, GlobalStyles.textMedium]}>{ `${index + 1}.`}</Text>
                        <TextInput
                            value={item}
                            style={[styles.inputText, styles.inputDirection, GlobalStyles.textMedium]}
                            placeholder='direction'
                            onChangeText={direction => direcOnChange(key, direction)}
                            ref={inputRef}
                            multiline={true}
                        />
                        <TouchableOpacity
                            onPress={() => deleteDirection(key)}
                            style={styles.deleteDirectionButton}
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
                onPress={addDirection}
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
    directions: {
        flexDirection: 'row',
    },
    listNum: {
        marginTop: normalizeHeight(5),
        marginRight: normalizeWidth(5),
    },
    inputDirection: {
        flex: 9
    },
    deleteDirectionButton: {
        flex: 1,
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
        marginBottom: normalizeHeight(40)
    },
})

export default DirectionsInput