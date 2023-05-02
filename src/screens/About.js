import {
    Text,
    StyleSheet,
    ScrollView,
    Image
} from "react-native"
import { GlobalStyles, Colors, normalizeHeight, normalizeWidth } from "../utils/GlobalStyles"

// About page for the app
const About = () => {
    return (
        <ScrollView style={styles.body}>
            <Text style={[GlobalStyles.textExLarge, styles.title]}>About Recipe Book</Text>
            <Text style={[GlobalStyles.textMedium, styles.paragraph]}>
                Recipe book is an app that was inspired by my mother's old, beat up notebook that
                contained many of the recipes that made up my childhood. I noticed that I had many
                tabs open on my phone that were recipes that i either wanted to try or have tried and 
                liked. I thought it would be nice to have them all in a single place for convenience and 
                it would be a good way to learn about react native and mobile developement. 
            </Text>
            <Text style={[GlobalStyles.textMedium, styles.paragraph]}>
                This app is far from complete. I still have certain features in mind to add to the app that will
                come in time.
            </Text>

            <Text style={[GlobalStyles.textLarge, styles.subTitle]}>
                Credits:
            </Text>
            <Text style={[GlobalStyles.textMedium, styles.paragraph]}>
                Developed by Philip Dometita
            </Text>
            <Image style={styles.img} source={require('../assets/recipe-book.png')} tintColor={Colors.gold} />
            <Text style={[GlobalStyles.textMedium, styles.paragraph, styles.credit]}>
                https://www.flaticon.com/free-icons/recipe Recipe icons created by Freepik (https://www.freepik.com/)
            </Text>
            <Image style={styles.img} source={require('../assets/forkAndSpoon.png')} />
            <Text style={[GlobalStyles.textMedium, styles.paragraph, styles.credit]}>
                https://www.flaticon.com/free-icons/restaurant Restaurant icons created by Ilham Fitrotul Hayat (https://www.flaticon.com/authors/ilham-fitrotul-hayat)
            </Text>
            
            <Text style={[GlobalStyles.textMedium, styles.paragraph]}>
                Pancake picture used in the How to page:
            </Text>
            <Text style={[GlobalStyles.textMedium, styles.paragraph, styles.credit]}>
                Ash Craig (https://www.ashcraig.com) https://www.pexels.com/photo/pancake-with-sliced-strawberry-376464/
            </Text>
            <Text style={[GlobalStyles.textMedium, styles.paragraph]}>
                Various stack overflow questions and internet tutorials (MVP)
            </Text>
        </ScrollView>
    )
}

export default About

const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.extraLightGold,
        flex: 1,
        paddingVertical: normalizeHeight(10),
        paddingHorizontal: normalizeWidth(10),
    },
    title: {
        alignSelf: 'center',
        marginBottom: normalizeHeight(20),
    },
    paragraph: {
        marginBottom: normalizeHeight(10),
    },
    subTitle: {
        borderBottomColor: Colors.gold,
        borderBottomWidth: normalizeWidth(1),
        paddingBottom: normalizeHeight(5),
        marginVertical: normalizeHeight(10)
    },
    img: {
        alignSelf: 'center',
        marginBottom: normalizeHeight(10),
        height: normalizeWidth(100),
        width: normalizeWidth(100)
    },
    credit: {
        alignSelf: 'center'
    }
})