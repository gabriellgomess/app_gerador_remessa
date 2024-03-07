import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { Card, CardContent, Dialog, DialogTitle, DialogContent, Typography, Button, IconButton, styled, Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function CustomizedDialogs({ open, dados, onClose }) {
    const [clientes, setClientes] = useState([])

    useEffect(() => {
        // Verifica se dados.id existe antes de fazer a solicitação
        if (dados && dados.id) {
            const data = {
                'id': dados.id
            };
            axios.post('https://rem.nexustech.net.br/api_rem/busca_clientes.php', data)
                .then((response) => {
                    console.log(response.data.dadosClientes);
                    setClientes(response.data.dadosClientes);
                    // Corrigido para 'setClientes'
                })
                .catch((error) => {
                    console.error("Erro na solicitação: ", error);
                    // Aqui você pode definir um estado para mostrar uma mensagem de erro, se necessário.
                });
        }
    }, [dados, dados.id]); // Inclui dados.id nas dependências

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'nome',
            headerName: 'Nome',
            width: 300,

        },
        {
            field: 'cpf',
            headerName: 'CPF',
            width: 150,

        },
        {
            field: 'banco',
            headerName: 'Banco',
            width: 110,

        },
        {
            field: 'agencia',
            headerName: 'Agencia',
            width: 110,

        },
        {
            field: 'conta',
            headerName: 'Conta',
            width: 110,

        },
        {
            field: 'digito',
            headerName: 'Digito',
            width: 110,

        },
        {
            field: 'valor',
            headerName: 'Valor',
            width: 110,
            valueFormatter: ({ value }) => new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(value),

        },
    ];

    return (
        <React.Fragment>
            <BootstrapDialog
                onClose={onClose} // Use a prop `onClose` aqui para lidar com o fechamento do diálogo
                aria-labelledby="customized-dialog-title"
                open={open}
                maxWidth='lg'
                fullWidth='true'
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Dados da importação {dados.id}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={onClose} // Use a prop `onClose` aqui para fechar o modal
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers sx={{ display: 'flex', gap: '10px' }}>
                    <Card sx={{ width: 250 }}>
                        <CardContent>
                            <Typography variant='caption'>
                                Banco
                            </Typography>
                            <Typography variant='h4'>
                                {dados.banco}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ width: 250 }}>
                        <CardContent>
                            <Typography variant='caption'>
                                Quantidade:
                            </Typography>
                            <Typography variant='h4'>
                                {dados.qtd_registros}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ width: 250 }}>
                        <CardContent>
                            <Typography variant='caption'>
                                Valor Total
                            </Typography>
                            <Typography variant='h4'>
                                {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                }).format(dados.valor_total)}
                            </Typography>
                        </CardContent>
                    </Card>
                </DialogContent>
                <DialogContent>
                    <Box sx={{ maxHeight: '300px', padding: '10px 0' }}>
                        <DataGrid
                            rows={clientes}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            disableSelectionOnClick
                        />
                    </Box>


                </DialogContent>

            </BootstrapDialog>
        </React.Fragment>
    );
}