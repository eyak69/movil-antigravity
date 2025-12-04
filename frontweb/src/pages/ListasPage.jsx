import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Card, CardContent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import { Add, Edit, Delete } from '@mui/icons-material';
import api from '../services/api';

const ListasPage = () => {
    const [listas, setListas] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentLista, setCurrentLista] = useState({ nombrecorto: '', nombrelargo: '' });
    const [isEdit, setIsEdit] = useState(false);
    const [searchText, setSearchText] = useState('');

    const fetchListas = async () => {
        try {
            const response = await api.get('/listas');
            setListas(response.data);
        } catch (error) {
            console.error('Error fetching listas:', error);
        }
    };

    useEffect(() => {
        fetchListas();
    }, []);

    const handleOpen = (lista = { nombrecorto: '', nombrelargo: '' }) => {
        setCurrentLista(lista);
        setIsEdit(!!lista.id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentLista({ nombrecorto: '', nombrelargo: '' });
    };

    const handleSave = async () => {
        try {
            if (isEdit) {
                await api.put(`/listas/${currentLista.id}`, currentLista);
            } else {
                await api.post('/listas', currentLista);
            }
            fetchListas();
            handleClose();
        } catch (error) {
            console.error('Error saving lista:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta lista?')) {
            try {
                await api.delete(`/listas/${id}`);
                fetchListas();
            } catch (error) {
                console.error('Error deleting lista:', error);
            }
        }
    };

    const filteredListas = listas.filter((l) =>
        l.nombrecorto.toLowerCase().includes(searchText.toLowerCase()) ||
        l.nombrelargo.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'nombrecorto', headerName: 'Nombre Corto', width: 150 },
        { field: 'nombrelargo', headerName: 'Nombre Largo', flex: 1, minWidth: 250 },
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
                <Typography variant="h4" color="text.primary">Listas de Precios</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    Nueva Lista
                </Button>
            </Box>

            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <TextField
                        label="Buscar Lista"
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
                            rows={filteredListas}
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
                <DialogTitle>{isEdit ? 'Editar Lista' : 'Nueva Lista'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nombre Corto"
                        fullWidth
                        value={currentLista.nombrecorto}
                        onChange={(e) => setCurrentLista({ ...currentLista, nombrecorto: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Nombre Largo"
                        fullWidth
                        value={currentLista.nombrelargo}
                        onChange={(e) => setCurrentLista({ ...currentLista, nombrelargo: e.target.value })}
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

export default ListasPage;
