import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material'
import Table from '../components/Table';
import axios from 'axios';

const Importacoes = () => {
    const [importacoes, setImportacoes] = useState([])

    useEffect(()=>{
        axios.post('https://rem.nexustech.net.br/api_rem/busca_importacoes.php')
            .then((response) => {
                console.log(response.data)
                setImportacoes(response.data)
            })

    }, [])

    return (
        <>
            <Typography variant='h4' sx={{marginBottom: 5}}>Importações</Typography>
            <Table rows={importacoes} />
        </>

    )
}

export default Importacoes;