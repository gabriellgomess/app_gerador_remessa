import React, { useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { DataGrid, ptBR } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ArticleIcon from '@mui/icons-material/Article';

import ModalImportacoes from './ModalImportacoes';


const Table = ({ rows }) => {
    const [open, setOpen] = useState(false);
    const [ dados, setDados ] = useState([])


    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            flex: 1
        },
        {
            field: 'parceiro',
            headerName: 'Parceiro',
            flex: 4
        },
        {
            field: 'usuario',
            headerName: 'Usuário',
            flex: 3
        },
        {
            field: 'banco',
            headerName: 'Banco',
            flex: 2
        },
        {
            field: 'qtd_registros',
            headerName: 'Quantidade',
            flex: 2
        },
        {
            field: 'valor_total',
            headerName: 'Valor Total',
            flex: 3,
            valueFormatter: ({ value }) => new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(value),
        },
        {
            field: 'visualizar',
            headerName: 'Visualizar',
            flex: 1,
            renderCell: (params) => (
                <IconButton color="primary" aria-label="Editar registro"
                    onClick={() => handleEdit(params.row)}
                >
                    <VisibilityIcon />
                </IconButton>
            ),
        },
        {
            field: 'gerar_remessa',
            headerName: 'Gerar REM',
            flex: 1,
            renderCell: (params) => (
                <IconButton aria-label="Editar registro"
                    onClick={() => handleEdit(params.row)}
                >
                    <ArticleIcon />
                </IconButton>
            ),
        },
        {
            field: 'apagar',
            headerName: 'Apagar',
            flex: 1,
            renderCell: (params) => (
                <IconButton color="warning" aria-label="Apagar registro"
                    onClick={() => handleDelete(params.row)}
                >
                    <DeleteSweepIcon />
                </IconButton>
            ),
        },
    ];

    const handleEdit = (row) => {
        setDados(row); // Atualiza o estado `dados` com os dados da linha
        setOpen(true); // Abre o modal
    };
    

    const handleDelete = (row) => {
        console.log(row); // Aqui você tem todos os valores da row
        // Você pode chamar outra função aqui, passando `row` ou parte dela
    };

    return (
        <Box sx={{ minHeight: 300, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 15,
                        },
                    },
                }}
                pageSizeOptions={[15]}
                // checkboxSelection
                disableRowSelectionOnClick
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            />
            <ModalImportacoes open={open} dados={dados} onClose={() => setOpen(false)} />
        </Box>
    );
}

export default Table;