import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Button, Appbar, Title, Paragraph, Card } from 'react-native-paper';
import { useDatabase } from '../context/DatabaseContext';

export default function DeveloperScreen() {
    const db = useDatabase();

    const API_URL = 'http://192.168.1.64:3000/api'; // Adjust IP as needed

    const nukePersonas = () => {
        Alert.alert(
            'PELIGRO',
            '¿Estás seguro de borrar TODAS las personas físicamente (Local y Servidor)? Esto no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'BORRAR TODO',
                    style: 'destructive',
                    onPress: async () => {
                        if (!db) return;
                        try {
                            // 1. Delete from Server
                            await fetch(`${API_URL}/dev/personas`, { method: 'DELETE' });

                            // 2. Delete Locally
                            await db.runAsync('DELETE FROM personas');
                            await db.runAsync("DELETE FROM metadata WHERE key = 'last_sync'");
                            Alert.alert('Éxito', 'Tabla personas vaciada en local y servidor. Sync reiniciado.');
                        } catch (error) {
                            console.error('Error nuking personas:', error);
                            Alert.alert('Error', 'Falló el borrado de personas.');
                        }
                    },
                },
            ]
        );
    };

    const nukeProductos = () => {
        Alert.alert(
            'PELIGRO',
            '¿Estás seguro de borrar TODOS los productos físicamente (Local y Servidor)? Esto no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'BORRAR TODO',
                    style: 'destructive',
                    onPress: async () => {
                        if (!db) return;
                        try {
                            // 1. Delete from Server
                            await fetch(`${API_URL}/dev/productos`, { method: 'DELETE' });

                            // 2. Delete Locally
                            await db.runAsync('DELETE FROM productos');
                            Alert.alert('Éxito', 'Tabla productos vaciada en local y servidor.');
                        } catch (error) {
                            console.error('Error nuking productos:', error);
                            Alert.alert('Error', 'Falló el borrado de productos.');
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.Content title="Desarrollador" />
            </Appbar.Header>

            <View style={styles.content}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={{ color: 'red' }}>ZONA DE PELIGRO</Title>
                        <Paragraph>Estas acciones borran datos locales físicamente sin posibilidad de recuperación.</Paragraph>
                    </Card.Content>
                </Card>

                <Button
                    mode="contained"
                    onPress={() => {
                        Alert.alert(
                            'Confirmar',
                            '¿Borrar solo los datos LOCALES de personas? Los datos del servidor NO se tocarán. Se reiniciará el sync.',
                            [
                                { text: 'Cancelar', style: 'cancel' },
                                {
                                    text: 'Borrar Local',
                                    style: 'destructive',
                                    onPress: async () => {
                                        if (!db) return;
                                        try {
                                            await db.runAsync('DELETE FROM personas');
                                            await db.runAsync("DELETE FROM metadata WHERE key = 'last_sync'");
                                            Alert.alert('Éxito', 'Datos locales borrados y sync reiniciado.');
                                        } catch (error) {
                                            console.error('Error clearing local personas:', error);
                                            Alert.alert('Error', 'Falló el borrado local.');
                                        }
                                    },
                                },
                            ]
                        );
                    }}
                    style={styles.button}
                    buttonColor="#fbc02d"
                    icon="database-remove"
                >
                    Borrar Solo Local (Personas)
                </Button>

                <Button
                    mode="contained"
                    onPress={nukePersonas}
                    style={styles.button}
                    buttonColor="#d32f2f"
                    icon="delete-forever"
                >
                    Borrar TODAS las Personas
                </Button>

                <Button
                    mode="contained"
                    onPress={nukeProductos}
                    style={styles.button}
                    buttonColor="#d32f2f"
                    icon="delete-forever"
                >
                    Borrar TODOS los Productos
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
    header: {
        backgroundColor: '#333',
    },
    content: {
        padding: 20,
    },
    card: {
        marginBottom: 20,
        backgroundColor: '#ffebee',
    },
    button: {
        marginBottom: 15,
        paddingVertical: 5,
    },
});
