import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Keyboard } from 'react-native';
import { TextInput, Button, Appbar, Title, Snackbar } from 'react-native-paper';
import { useDatabase } from '../context/DatabaseContext';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import * as ImagePicker from 'expo-image-picker';
import { Avatar } from 'react-native-paper';

export default function PersonaFormScreen({ navigation, route }) {
    const db = useDatabase();
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [direccion, setDireccion] = useState('');
    const [foto, setFoto] = useState(null);
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');

    const params = route.params || {};
    const editMode = params.editMode || false;
    const editItem = params.item || null;

    useEffect(() => {
        if (editMode && editItem) {
            setNombre(editItem.nombre || '');
            setTelefono(editItem.telefono || '');
            setEmail(editItem.email || '');
            setDireccion(editItem.direccion || '');
            setFoto(editItem.foto || null);
        }
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            setFoto('data:image/jpeg;base64,' + result.assets[0].base64);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Se necesita permiso para usar la cámara');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            setFoto('data:image/jpeg;base64,' + result.assets[0].base64);
        }
    };

    const onDismissSnackBar = () => {
        setVisible(false);
        navigation.goBack();
    };

    const handleSubmit = async () => {
        if (!nombre || !telefono) {
            Alert.alert('Error', 'Nombre y Teléfono son obligatorios');
            return;
        }

        if (!db) return;

        try {
            let success = false;
            // Ensure all parameters are strings or numbers, never undefined
            const pNombre = nombre || '';
            const pTelefono = telefono || '';
            const pEmail = email || '';
            const pDireccion = direccion || '';
            const pFoto = foto || null;
            const now = new Date().toISOString();

            if (editMode && editItem) {
                const hasChanges =
                    pNombre !== (editItem.nombre || '') ||
                    pTelefono !== (editItem.telefono || '') ||
                    pEmail !== (editItem.email || '') ||
                    pDireccion !== (editItem.direccion || '') ||
                    pFoto !== (editItem.foto || null);

                if (!hasChanges) {
                    navigation.goBack();
                    return;
                }
            }

            if (editMode && editItem?.id) {
                const result = await db.runAsync(
                    'UPDATE personas SET nombre = ?, telefono = ?, email = ?, direccion = ?, foto = ?, updatedAt = ?, is_synced = 0 WHERE id = ?',
                    pNombre, pTelefono, pEmail, pDireccion, pFoto, now, editItem.id
                );
                if (result.changes > 0) {
                    success = true;
                    setMessage('Contacto actualizado correctamente');
                }
            } else {
                const newId = uuidv4();
                const result = await db.runAsync(
                    'INSERT INTO personas (id, nombre, telefono, email, direccion, foto, updatedAt, is_synced, deleted) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)',
                    newId, pNombre, pTelefono, pEmail, pDireccion, pFoto, now
                );
                if (result.changes > 0) {
                    success = true;
                    setMessage('Contacto creado correctamente');
                }
            }

            if (success) {
                Keyboard.dismiss();
                setVisible(true);
            } else {
                Alert.alert('Error', 'No se pudo guardar el contacto');
            }
        } catch (error) {
            console.error('Error saving persona:', error);
            Alert.alert('Error', 'Error al guardar en la base de datos');
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={editMode ? 'Editar Contacto' : 'Nuevo Contacto'} />
            </Appbar.Header>

            <View style={styles.content}>
                <View style={styles.form}>
                    <View style={styles.avatarContainer}>
                        {foto ? (
                            <Avatar.Image size={100} source={{ uri: foto }} />
                        ) : (
                            <Avatar.Icon size={100} icon="account" />
                        )}
                        <View style={styles.avatarButtons}>
                            <Button mode="outlined" onPress={pickImage} icon="image">Galería</Button>
                            <Button mode="outlined" onPress={takePhoto} icon="camera">Cámara</Button>
                        </View>
                    </View>

                    <TextInput
                        label="Nombre"
                        value={nombre}
                        onChangeText={setNombre}
                        mode="outlined"
                        style={styles.input}
                    />
                    <TextInput
                        label="Teléfono"
                        value={telefono}
                        onChangeText={setTelefono}
                        keyboardType="phone-pad"
                        mode="outlined"
                        style={styles.input}
                    />
                    <TextInput
                        label="Email (Opcional)"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        mode="outlined"
                        style={styles.input}
                    />
                    <TextInput
                        label="Dirección (Opcional)"
                        value={direccion}
                        onChangeText={setDireccion}
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
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarButtons: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 10,
    },
});
