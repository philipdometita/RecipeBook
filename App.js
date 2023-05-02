import {
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView
} from 'react-native'
import { useEffect, useState, useCallback } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Provider } from 'react-redux'
import { MenuProvider } from 'react-native-popup-menu'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SplashScreen from 'expo-splash-screen'
import * as Font from 'expo-font'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { useDispatch } from 'react-redux'
import { setRecipes } from './src/redux/actions'

import AllRecipes from './src/screens/AllRecipes'
import Recipe from './src/screens/Recipe'
import RecipeEdit from './src/screens/RecipeEdit'
import About from './src/screens/About'
import HowTo from './src/screens/HowTo'
import { Store } from './src/redux/store';
import { Colors, normalizeSize } from "./src/utils/GlobalStyles"
import SearchBar from './src/utils/SearchBar'

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync()

const AppWrapper = () => {
  return (
    <Provider store={Store}>
      <App />
    </Provider>
  )
}

const App = () => {

  const customFonts = {
    'RobotoSlab': require('./src/assets/fonts/RobotoSlab-VariableFont_wght.ttf')
  }

  const [appIsReady, setAppIsReady] = useState(false)

  const dispatch = useDispatch()

  // load recipes from async storage and dispatch to redux
  const getRecipes = () => {
      AsyncStorage.getItem("Recipes")
          .then(recipes => {
              const parsedRecipes = JSON.parse(recipes)
              if (parsedRecipes && typeof parsedRecipes === 'object') {
                  dispatch(setRecipes(parsedRecipes))
              }
          })
          .catch(error => console.log(error))
  }

  useEffect(() => {
    async function prepare() {
      try {
        getRecipes()
        await Font.loadAsync(customFonts)
      } catch (e) {
        console.warn(e)
      } finally {
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync()
    }
  }, [appIsReady])

  if (!appIsReady) {
    return null
  }

  return (
    <SafeAreaView onLayout={onLayoutRootView} style={styles.container}>
      <MenuProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="All Recipes"
            screenOptions={{
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: Colors.gold
              },
              headerTintColor: Colors.white,
              headerTitleStyle: {
                fontSize: normalizeSize(25),
              },
              headerShadowVisible: false
            }}
          >
            {/* main screen for all recipes */}
            <Stack.Screen
              name="All Recipes"
              component={AllRecipes}
              options={{
                headerTransparent: false,
                title: '',
                headerTitle: () => (
                  <SearchBar/>
                ),
              }} //////////////////////// add button for drop down to about page and settings
            />
            {/* screen for displaying specific recipe */}
            <Stack.Screen
              name="Recipe"
              component={Recipe}
              options={{
                title: '',
                headerRight: () => (
                  <TouchableOpacity title='Edit'>
                    <Text>Edit Recipe</Text>
                    <MaterialCommunityIcons
                      name='pencil-outline'
                      size={normalizeSize(25)}
                      color={Colors.white}
                    />
                  </TouchableOpacity>
                )
              }}
            />
            {/* screen for editing / creating new recipe */}
            <Stack.Screen
              name="RecipeEdit"
              component={RecipeEdit}
              options={{
                title: '',
                headerRight: () => (
                  <TouchableOpacity title='Save'>
                    <Text>Save Recipe</Text>
                    <MaterialCommunityIcons
                      name='check'
                      size={normalizeSize(25)}
                      color={Colors.white}
                    />
                  </TouchableOpacity>
                )
              }}
            />
            <Stack.Screen
              name='About'
              component={About}
              options={{
                title: '',
              }}
            />
            <Stack.Screen
              name='HowTo'
              component={HowTo}
              options={{
                title: '',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </MenuProvider>
    </SafeAreaView>
  );
}

export default AppWrapper

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});

