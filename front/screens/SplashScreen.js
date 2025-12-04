import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, ActivityIndicator } from 'react-native-paper';

export default function SplashScreen({ navigation }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Home');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Title style={styles.title}>Bienvenido a Mi App</Title>
            <ActivityIndicator animating={true} color="#3498db" size="large" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
});
