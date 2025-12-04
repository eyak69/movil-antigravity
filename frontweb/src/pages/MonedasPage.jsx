import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Card, CardContent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import { Add, Edit, Delete } from '@mui/icons-material';
import api from '../services/api';

const MonedasPage = () => {
    const [monedas, setMonedas] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentMoneda, setCurrentMoneda] = useState({ nombre: '', simbolo: '' });
    const [isEdit, setIsEdit] = useState(false);
    const [searchText, setSearchText] = useState('');

    const fetchMonedas = async () => {
        try {
            const response = await api.get('/monedas');
            setMonedas(response.data);
        } catch (error) {
            console.error('Error fetching monedas:', error);
        }
    };

    useEffect(() => {
        fetchMonedas();
    }, []);

    const handleOpen = (moneda = { nombre: '', simbolo: '' }) => {
        setCurrentMoneda(moneda);
        setIsEdit(!!moneda.id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentMoneda({ nombre: '', simbolo: '' });
    };

    const handleSave = async () => {
        try {
            if (isEdit) {
                await api.put(`/monedas/${currentMoneda.id}`, currentMoneda);
            } else {
                await api.post('/monedas', currentMoneda);
            }
            fetchMonedas();
            handleClose();
        } catch (error) {
            console.error('Error saving moneda:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta moneda?')) {
            try {
                await api.delete(`/monedas/${id}`);
                fetchMonedas();
            } catch (error) {
                console.error('Error deleting moneda:', error);
            }
        }
    };

    const filteredMonedas = monedas.filter((m) =>
        m.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        m.simbolo.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 150 },
        { field: 'simbolo', headerName: 'Símbolo', width: 150 },
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
                <Typography variant="h4" color="text.primary">Monedas</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    Nueva Moneda
                </Button>
            </Box>

            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <TextField
                        label="Buscar Moneda"
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
                            rows={filteredMonedas}
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
                <DialogTitle>{isEdit ? 'Editar Moneda' : 'Nueva Moneda'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nombre"
                        fullWidth
                        value={currentMoneda.nombre}
                        onChange={(e) => setCurrentMoneda({ ...currentMoneda, nombre: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Símbolo"
                        fullWidth
                        value={currentMoneda.simbolo}
                        onChange={(e) => setCurrentMoneda({ ...currentMoneda, simbolo: e.target.value })}
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

export default MonedasPage;
