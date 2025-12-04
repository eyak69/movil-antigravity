import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { Button, Card, Title, Paragraph, Appbar, Searchbar, Chip, IconButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'http://192.168.1.64:3000/api/productos';

export default function ProductosScreen({ navigation }) {
    const [productos, setProductos] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('nombre'); // 'nombre' | 'precio'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

    useFocusEffect(
        useCallback(() => {
            fetchProductos();
        }, [])
    );

    useEffect(() => {
        filterAndSort();
    }, [productos, searchQuery, sortBy, sortOrder]);

    const fetchProductos = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setProductos(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            Alert.alert('Error', 'No se pudo conectar con el servidor');
        }
    };

    const filterAndSort = () => {
        let result = [...productos];

        // Filter
        if (searchQuery) {
            result = result.filter(item =>
                item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort
        result.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'nombre') {
                comparison = a.nombre.localeCompare(b.nombre);
            } else if (sortBy === 'precio') {
                comparison = parseFloat(a.precio) - parseFloat(b.precio);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        setFilteredProductos(result);
    };

    const onChangeSearch = (query) => setSearchQuery(query);

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const handleDelete = async (id) => {
        Alert.alert(
            'Confirmar',
            '¿Estás seguro de eliminar este producto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`${API_URL}/${id}`, {
                                method: 'DELETE',
                            });
                            if (response.ok) {
                                fetchProductos();
                            } else {
                                Alert.alert('Error', 'No se pudo eliminar el producto');
                            }
                        } catch (error) {
                            console.error('Error deleting product:', error);
                            Alert.alert('Error', 'Error de red');
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <Title>{item.nombre}</Title>
                <Paragraph style={styles.price}>
                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.precio)}
                </Paragraph>
            </Card.Content>
            <Card.Actions>
                <Button onPress={() => navigation.navigate('ProductoForm', { editMode: true, item })} icon="pencil">Editar</Button>
                <Button onPress={() => handleDelete(item.id)} color="red" icon="delete">Eliminar</Button>
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Mis Productos" />
                <Appbar.Action icon="plus" onPress={() => navigation.navigate('ProductoForm', { editMode: false })} />
            </Appbar.Header>

            <View style={styles.content}>
                <Searchbar
                    placeholder="Buscar producto"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={styles.searchbar}
                />

                <View style={styles.sortContainer}>
                    <Chip
                        selected={sortBy === 'nombre'}
                        onPress={() => setSortBy('nombre')}
                        style={styles.chip}
                        showSelectedOverlay
                    >
                        Nombre
                    </Chip>
                    <Chip
                        selected={sortBy === 'precio'}
                        onPress={() => setSortBy('precio')}
                        style={styles.chip}
                        showSelectedOverlay
                    >
                        Precio
                    </Chip>
                    <IconButton
                        icon={sortOrder === 'asc' ? 'sort-ascending' : 'sort-descending'}
                        onPress={toggleSortOrder}
                    />
                </View>

                <FlatList
                    data={filteredProductos}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                />
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
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2ecc71',
        marginTop: 5,
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    chip: {
        marginRight: 8,
    },
});
