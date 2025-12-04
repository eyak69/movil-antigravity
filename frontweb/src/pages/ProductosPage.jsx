import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Card, CardContent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import { Add, Edit, Delete } from '@mui/icons-material';
import api from '../services/api';

const ProductosPage = () => {
    const [productos, setProductos] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentProducto, setCurrentProducto] = useState({ nombre: '', precio: '' });
    const [isEdit, setIsEdit] = useState(false);
    const [searchText, setSearchText] = useState('');

    const fetchProductos = async () => {
        try {
            const response = await api.get('/productos');
            setProductos(response.data);
        } catch (error) {
            console.error('Error fetching productos:', error);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const handleOpen = (producto = { nombre: '', precio: '' }) => {
        setCurrentProducto(producto);
        setIsEdit(!!producto.id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentProducto({ nombre: '', precio: '' });
    };

    const handleSave = async () => {
        try {
            if (isEdit) {
                await api.put(`/productos/${currentProducto.id}`, currentProducto);
            } else {
                await api.post('/productos', currentProducto);
            }
            fetchProductos();
            handleClose();
        } catch (error) {
            console.error('Error saving producto:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            try {
                await api.delete(`/productos/${id}`);
                fetchProductos();
            } catch (error) {
                console.error('Error deleting producto:', error);
            }
        }
    };

    const filteredProductos = productos.filter((p) =>
        p.nombre.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 200 },
        { field: 'precio', headerName: 'Precio Base', width: 150 },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 150,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => handleOpen(params.row)} color="primary">
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row.id)} color="error">
                        <Delete />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                <Typography variant="h4" color="text.primary">Productos</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    Nuevo Producto
                </Button>
            </Box>

            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <TextField
                        label="Buscar Producto"
                        variant="outlined"
                        fullWidth
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Box sx={{ height: 500, width: '100%' }}>
                        <DataGrid
                            rows={filteredProductos}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10, 25]}
                            disableSelectionOnClick
                            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                        />
                    </Box>
                </CardContent>
            </Card>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nombre"
                        fullWidth
                        value={currentProducto.nombre}
                        onChange={(e) => setCurrentProducto({ ...currentProducto, nombre: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Precio Base"
                        type="number"
                        fullWidth
                        value={currentProducto.precio}
                        onChange={(e) => setCurrentProducto({ ...currentProducto, precio: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained">Guardar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductosPage;
