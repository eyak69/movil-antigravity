import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Title, Appbar } from 'react-native-paper';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Inicio" />
            </Appbar.Header>

            <View style={styles.content}>
                <Title style={styles.title}>Bienvenido</Title>

                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Productos')}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                >
                    Ir a Productos
                </Button>

                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Personas')}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                >
                    Ir a Personas
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#333',
    },
    button: {
        marginVertical: 10,
        width: '100%',
        maxWidth: 300,
    },
    buttonContent: {
        paddingVertical: 8,
    },
});
