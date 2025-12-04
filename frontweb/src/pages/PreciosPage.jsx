import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel, Card, CardContent, IconButton, InputAdornment } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import { Add, Search } from '@mui/icons-material';
import api from '../services/api';

const PreciosPage = () => {
    const [precios, setPrecios] = useState([]);
    const [open, setOpen] = useState(false);

    // Catalogs
    const [productos, setProductos] = useState([]);
    const [listas, setListas] = useState([]);
    const [monedas, setMonedas] = useState([]);

    // Filters
    const [selectedMoneda, setSelectedMoneda] = useState('');
    const [selectedLista, setSelectedLista] = useState('');
    const [searchText, setSearchText] = useState('');

    // Form State
    const [newPrice, setNewPrice] = useState({ productoId: '', listaId: '', monedaId: '', precio: '' });
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Product Finder State
    const [openProductFinder, setOpenProductFinder] = useState(false);
    const [productSearchText, setProductSearchText] = useState('');

    useEffect(() => {
        fetchCatalogs();
        fetchPrecios();
    }, []);

    const fetchCatalogs = async () => {
        try {
            const [prodRes, listRes, monRes] = await Promise.all([
                api.get('/productos'),
                api.get('/listas'),
                api.get('/monedas')
            ]);
            setProductos(prodRes.data);
            setListas(listRes.data);
            setMonedas(monRes.data);
        } catch (error) {
            console.error('Error fetching catalogs:', error);
        }
    };

    const fetchPrecios = async () => {
        try {
            const response = await api.get('/listaprecios');
            setPrecios(response.data);
        } catch (error) {
            console.error('Error fetching precios:', error);
        }
    };

    const handleSave = async () => {
        try {
            await api.post('/listaprecios', {
                productoId: newPrice.productoId,
                listaId: newPrice.listaId,
                monedaId: newPrice.monedaId,
                precio: newPrice.precio
            });
            fetchPrecios();
            setOpen(false);
            setNewPrice({ productoId: '', listaId: '', monedaId: '', precio: '' });
            setSelectedProduct(null);
        } catch (error) {
            console.error('Error saving precio:', error);
        }
    };

    const handleProductSelect = (product) => {
        setNewPrice({ ...newPrice, productoId: product.id });
        setSelectedProduct(product);
        setOpenProductFinder(false);
        setProductSearchText('');
    };

    const filteredPrecios = precios.filter((p) => {
        const matchesMoneda = selectedMoneda ? p.monedaId === selectedMoneda : true;
        const matchesLista = selectedLista ? p.listaId === selectedLista : true;
        const matchesSearch = searchText
            ? p.Producto?.nombre.toLowerCase().includes(searchText.toLowerCase())
            : true;
        return matchesMoneda && matchesLista && matchesSearch;
    });

    const filteredProductsForFinder = productos.filter((p) =>
        p.nombre.toLowerCase().includes(productSearchText.toLowerCase())
    );

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'producto', headerName: 'Producto', flex: 1, minWidth: 200, valueGetter: (value, row) => row.Producto?.nombre || '' },
        { field: 'lista', headerName: 'Lista', flex: 1, minWidth: 150, valueGetter: (value, row) => row.Listum?.nombrecorto || '' },
        { field: 'moneda', headerName: 'Moneda', width: 100, valueGetter: (value, row) => row.Moneda?.simbolo || '' },
        { field: 'precio', headerName: 'Precio', width: 120 },
        { field: 'fechaAlta', headerName: 'Fecha Alta', width: 200 },
    ];

    const productColumns = [
        { field: 'nombre', headerName: 'Nombre', flex: 1 },
        { field: 'precio', headerName: 'Precio Base', width: 120 },
        {
            field: 'action',
            headerName: 'Acción',
            width: 120,
            renderCell: (params) => (
                <Button size="small" variant="contained" onClick={() => handleProductSelect(params.row)}>
                    Seleccionar
                </Button>
            ),
        },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                <Typography variant="h4" color="text.primary">Gestión de Precios</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpen(true)}
                >
                    Nuevo Precio
                </Button>
            </Box>

            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Filtrar por Lista</InputLabel>
                            <Select
                                value={selectedLista}
                                label="Filtrar por Lista"
                                onChange={(e) => setSelectedLista(e.target.value)}
                            >
                                <MenuItem value=""><em>Todas</em></MenuItem>
                                {listas.map((l) => (
                                    <MenuItem key={l.id} value={l.id}>{l.nombrecorto}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Filtrar por Moneda</InputLabel>
                            <Select
                                value={selectedMoneda}
                                label="Filtrar por Moneda"
                                onChange={(e) => setSelectedMoneda(e.target.value)}
                            >
                                <MenuItem value=""><em>Todas</em></MenuItem>
                                {monedas.map((m) => (
                                    <MenuItem key={m.id} value={m.id}>{m.simbolo} - {m.nombre}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Buscar Producto"
                            variant="outlined"
                            fullWidth
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Box>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Box sx={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={filteredPrecios}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10, 25, 50]}
                            disableSelectionOnClick
                            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                        />
                    </Box>
                </CardContent>
            </Card>

            {/* Main Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Nuevo Precio</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            label="Producto"
                            fullWidth
                            margin="dense"
                            value={selectedProduct ? selectedProduct.nombre : ''}
                            InputProps={{
                                readOnly: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setOpenProductFinder(true)}>
                                            <Search />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            onClick={() => setOpenProductFinder(true)}
                            placeholder="Click para buscar producto..."
                        />

                        <FormControl fullWidth margin="dense">
                            <InputLabel>Lista</InputLabel>
                            <Select
                                value={newPrice.listaId}
                                label="Lista"
                                onChange={(e) => setNewPrice({ ...newPrice, listaId: e.target.value })}
                            >
                                {listas.map((l) => (
                                    <MenuItem key={l.id} value={l.id}>{l.nombrecorto}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Moneda</InputLabel>
                            <Select
                                value={newPrice.monedaId}
                                label="Moneda"
                                onChange={(e) => setNewPrice({ ...newPrice, monedaId: e.target.value })}
                            >
                                {monedas.map((m) => (
                                    <MenuItem key={m.id} value={m.id}>{m.simbolo} - {m.nombre}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            margin="dense"
                            label="Precio"
                            type="number"
                            fullWidth
                            value={newPrice.precio}
                            onChange={(e) => setNewPrice({ ...newPrice, precio: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained" disabled={!newPrice.productoId}>Guardar</Button>
                </DialogActions>
            </Dialog>

            {/* Product Finder Dialog */}
            <Dialog open={openProductFinder} onClose={() => setOpenProductFinder(false)} maxWidth="md" fullWidth>
                <DialogTitle>Buscar Producto</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Buscar por nombre..."
                        fullWidth
                        value={productSearchText}
                        onChange={(e) => setProductSearchText(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={filteredProductsForFinder}
                            columns={productColumns}
                            pageSize={5}
                            rowsPerPageOptions={[5, 10]}
                            disableSelectionOnClick
                            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenProductFinder(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PreciosPage;
