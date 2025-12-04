import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Button, Card, Title, Paragraph, Appbar, Searchbar, Chip, IconButton, Avatar } from 'react-native-paper';

// ... (rest of imports)

// ... (inside PersonaItem)
const PersonaItem = React.memo(({ item, onEdit, onDelete }) => (
    <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
            {item.foto ? (
                <Avatar.Image size={50} source={{ uri: item.foto }} style={styles.avatar} />
            ) : (
                <Avatar.Icon size={50} icon="account" style={styles.avatar} />
            )}
            <View style={styles.textContainer}>
                <View style={styles.cardHeader}>
                    <Title style={styles.cardTitle}>{item.nombre}</Title>
                    <IconButton
                        icon={item.is_synced ? "cloud-check" : "cloud-off-outline"}
                        iconColor={item.is_synced ? "#4caf50" : "#f44336"}
                        size={20}
                    />
                </View>
                <Paragraph style={styles.phone}>{item.telefono}</Paragraph>
                {item.email ? <Paragraph style={styles.detail}>{item.email}</Paragraph> : null}
                {item.direccion ? <Paragraph style={styles.detail}>{item.direccion}</Paragraph> : null}
            </View>
        </Card.Content>
        <Card.Actions>
            <Button onPress={() => onEdit(item)} icon="pencil">Editar</Button>
            <Button onPress={() => onDelete(item.id)} color="red" icon="delete">Eliminar</Button>
        </Card.Actions>
    </Card>
));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        padding: 15,
    },
    searchbar: {
        marginBottom: 15,
        elevation: 2,
        backgroundColor: '#fff',
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        marginBottom: 10,
        elevation: 2,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    phone: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginTop: 5,
    },
    detail: {
        fontSize: 14,
        color: '#777',
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    sortControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chip: {
        marginRight: 0,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        flex: 1,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
});
import { useFocusEffect } from '@react-navigation/native';
import { useDatabase } from '../context/DatabaseContext';
import { syncPersonas } from '../services/SyncService';
import * as Contacts from 'expo-contacts';
import { v4 as uuidv4 } from 'uuid';

export default function PersonasScreen({ navigation }) {
    const db = useDatabase();
    const [personas, setPersonas] = useState([]);
    const [filteredPersonas, setFilteredPersonas] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [syncing, setSyncing] = useState(false);
    const [importing, setImporting] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

    useFocusEffect(
        useCallback(() => {
            if (db) {
                fetchPersonas(db);
            }
        }, [db])
    );

    useEffect(() => {
        filterAndSort();
    }, [personas, searchQuery, sortOrder]);

    const fetchPersonas = useCallback(async (database = db) => {
        if (!database) return;
        try {
            const allRows = await database.getAllAsync('SELECT * FROM personas WHERE deleted = 0');
            setPersonas(allRows);
        } catch (error) {
            console.error('Error fetching personas:', error);
        }
    }, [db]);

    const filterAndSort = () => {
        let result = [...personas];

        // Filter
        if (searchQuery) {
            result = result.filter(item =>
                item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort (Always by name)
        result.sort((a, b) => {
            const comparison = a.nombre.localeCompare(b.nombre);
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        setFilteredPersonas(result);
    };

    const handleSync = async () => {
        if (!db) return;
        setSyncing(true);
        const result = await syncPersonas(db);
        setSyncing(false);

        if (result.success) {
            Alert.alert('Sincronización', `Se sincronizaron ${result.count} registros.`);
            fetchPersonas(); // Refresh list
        } else {
            Alert.alert('Error', 'Falló la sincronización');
        }
    };

    const onChangeSearch = (query) => setSearchQuery(query);

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const handleDelete = useCallback((id) => {
        Alert.alert(
            'Confirmar',
            '¿Estás seguro de eliminar este contacto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        if (!db) return;
                        try {
                            const now = new Date().toISOString();
                            const result = await db.runAsync(
                                'UPDATE personas SET deleted = 1, is_synced = 0, updatedAt = ? WHERE id = ?',
                                now, id
                            );
                            if (result.changes > 0) {
                                fetchPersonas();
                            } else {
                                Alert.alert('Error', 'No se pudo eliminar el contacto');
                            }
                        } catch (error) {
                            console.error('Error deleting persona:', error);
                            Alert.alert('Error', 'Error al eliminar de la base de datos');
                        }
                    },
                },
            ]
        );
    }, [db, fetchPersonas]);

    const handleEdit = useCallback((item) => {
        navigation.navigate('PersonaForm', { editMode: true, item });
    }, [navigation]);

    const importarContactosDelCelular = async () => {
        try {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                setImporting(true);
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
                });

                if (data.length > 0) {
                    const now = new Date().toISOString();
                    let importedCount = 0;

                    await db.withTransactionAsync(async () => {
                        for (const contact of data) {
                            if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
                                const rawPhone = contact.phoneNumbers[0].number;
                                const cleanPhone = rawPhone.replace(/[-()\s]/g, '');
                                const contactName = contact.name || cleanPhone || 'Sin Nombre';

                                const newPersona = {
                                    id: uuidv4(),
                                    nombre: contactName,
                                    telefono: cleanPhone,
                                    email: '',
                                    direccion: '',
                                    updatedAt: now,
                                    is_synced: 0,
                                    deleted: 0
                                };

                                await db.runAsync(
                                    'INSERT INTO personas (id, nombre, telefono, email, direccion, updatedAt, is_synced, deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                                    newPersona.id, newPersona.nombre, newPersona.telefono, newPersona.email, newPersona.direccion, newPersona.updatedAt, newPersona.is_synced, newPersona.deleted
                                );
                                importedCount++;
                            }
                        }
                    });

                    if (importedCount > 0) {
                        Alert.alert('Éxito', `Se importaron ${importedCount} contactos.`);
                        fetchPersonas();
                    } else {
                        Alert.alert('Aviso', 'No se encontraron contactos con número de teléfono.');
                    }
                } else {
                    Alert.alert('Aviso', 'No hay contactos en el teléfono.');
                }
            } else {
                Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a los contactos.');
            }
        } catch (error) {
            console.error('Error importing contacts:', error);
            Alert.alert('Error', 'Ocurrió un error al importar contactos.');
        } finally {
            setImporting(false);
        }
    };

    const unsyncedCount = personas.filter(p => !p.is_synced).length;

    const renderItem = useCallback(({ item }) => (
        <PersonaItem item={item} onEdit={handleEdit} onDelete={handleDelete} />
    ), [handleEdit, handleDelete]);

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Mi Agenda" />
                <Appbar.Action icon="import" onPress={importarContactosDelCelular} disabled={importing || syncing} />
                <Appbar.Action icon="sync" onPress={handleSync} disabled={importing || syncing} />
                <Appbar.Action icon="plus" onPress={() => navigation.navigate('PersonaForm', { editMode: false })} />
            </Appbar.Header>

            <View style={styles.content}>
                <Searchbar
                    placeholder="Buscar por nombre"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={styles.searchbar}
                />

                <View style={styles.sortContainer}>
                    <View style={styles.sortControls}>
                        <Chip
                            selected={true}
                            style={styles.chip}
                            showSelectedOverlay
                        >
                            Nombre
                        </Chip>
                        <IconButton
                            icon={sortOrder === 'asc' ? 'sort-ascending' : 'sort-descending'}
                            onPress={toggleSortOrder}
                            size={20}
                        />
                    </View>
                    <Chip
                        icon={unsyncedCount > 0 ? "alert-circle-outline" : "check-circle-outline"}
                        style={{ backgroundColor: unsyncedCount > 0 ? '#ffebee' : '#e8f5e9' }}
                        textStyle={{ color: unsyncedCount > 0 ? '#c62828' : '#2e7d32' }}
                    >
                        Sin sync ({unsyncedCount})
                    </Chip>
                </View>

                <FlatList
                    data={filteredPersonas}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                />
            </View>
            {(importing || syncing) && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#3498db" />
                </View>
            )}
        </View>
    );
}


