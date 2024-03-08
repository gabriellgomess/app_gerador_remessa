import React, { useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { DataGrid, ptBR } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ArticleIcon from '@mui/icons-material/Article';
// sweetalert2
import Swal from 'sweetalert2';

import ModalImportacoes from './ModalImportacoes';

import DownloadREM from '../pages/DownloadREM';
import axios from 'axios';

import { BANCOS } from './Config';


const Table = ({ rows, onUpdate }) => {
    const [open, setOpen] = useState(false);
    const [dados, setDados] = useState([])


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
            flex: 2,
            renderCell: (params) => (
                <>{BANCOS.find(banco => banco.cod === params.row.banco).nome}</>
            ),

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
                <>
                    <DownloadREM row={params.row} />
                </>

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
        const data = {
            importacaoId: row.id
        }
        // confirmação de exclusão
        Swal.fire({
            title: 'Deseja realmente apagar?',
            text: "Você não poderá reverter essa operação!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, apagar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('https://rem.nexustech.net.br/api_rem/deletar_importacao.php', data)
                    .then(response => {
                        Swal.fire(
                            'Registro apagado!',
                            response.data.message,
                            'success'
                        )
                        // Update the table data
                        onUpdate();
                    })
                    .catch(error => {
                        Swal.fire(
                            'Erro!',
                            'Erro ao apagar registro.',
                            'error'
                        )
                    })
            }
        })

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