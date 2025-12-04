import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Keyboard } from 'react-native';
import { TextInput, Button, Appbar, Snackbar } from 'react-native-paper';

const API_URL = 'http://192.168.1.64:3000/api/productos';

export default function ProductoFormScreen({ navigation, route }) {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');

    const editMode = route.params?.editMode || false;
    const editItem = route.params?.item || null;

    useEffect(() => {
        if (editMode && editItem) {
            setNombre(editItem.nombre);
            setPrecio(editItem.precio.toString());
        }
    }, []);

    const onDismissSnackBar = () => {
        setVisible(false);
        navigation.goBack();
    };

    const handleSubmit = async () => {
        if (!nombre || !precio) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        try {
            const url = editMode ? `${API_URL}/${editItem.id}` : API_URL;
            const method = editMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre,
                    precio: parseFloat(precio),
                }),
            });

            if (response.ok) {
                Keyboard.dismiss();
                setMessage(`Producto ${editMode ? 'actualizado' : 'creado'} correctamente`);
                setVisible(true);
            } else {
                Alert.alert('Error', 'No se pudo guardar el producto');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            Alert.alert('Error', 'Error de red');
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={editMode ? 'Editar Producto' : 'Nuevo Producto'} />
            </Appbar.Header>

            <View style={styles.content}>
                <View style={styles.form}>
                    <TextInput
                        label="Nombre del producto"
                        value={nombre}
                        onChangeText={setNombre}
                        mode="outlined"
                        style={styles.input}
                    />
                    <TextInput
                        label="Precio"
                        value={precio}
                        onChangeText={setPrecio}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.input}
                    />
                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        icon="content-save"
                        style={styles.button}
                    >
                        Guardar
                    </Button>
                </View>
            </View>
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                duration={1000}
                action={{
                    label: 'Cerrar',
                    onPress: () => {
                        // Do nothing
                    },
                }}>
                {message}
            </Snackbar>
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
        padding: 15,
    },
    form: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        elevation: 2,
    },
    input: {
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    button: {
        marginTop: 10,
    },
});
