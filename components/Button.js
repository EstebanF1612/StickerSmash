import { StyleSheet, View, Pressable, Text } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function Button({label, theme, onPress}){
    if (theme === 'primary') {
        return (
            <View style={[styles.buttoncontainer, {borderWidth: 4, borderColor: "#ffd33d", borderRadius: 18}]}>
                <Pressable style={[styles.button, {backgroundColor: "#fff"}]} onPress={onPress}>
                    <FontAwesome name="picture-o" size={18} color="#25292e" style={styles.buttonIcon} />
                    <Text style={[styles.buttonlabel, {color: "#25292e"}]}>{label}</Text>
                </Pressable>
            </View>
        );
    }
    return (
        <View style={styles.buttoncontainer}>
            <Pressable style={styles.button} onPress={onPress}>
                <Text style={styles.buttonlabel}>{label}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttoncontainer: {
        width: 320,
        height: 68,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    button: {
        borderRadius: 10,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonlabel: {
        color: '#fff',
        fontSize: 16,
    },
    buttonIcon:{
        paddingRight: 8,
    }
});