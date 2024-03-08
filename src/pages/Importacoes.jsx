import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material'
import Table from '../components/Table';
import axios from 'axios';

const Importacoes = () => {
    const [importacoes, setImportacoes] = useState([])
    const [update, setUpdate] = useState(false)

    const onUpdate = () => {
        setUpdate(!update)
    }

    useEffect(()=>{
        axios.post('https://rem.nexustech.net.br/api_rem/busca_importacoes.php')
            .then((response) => {
                console.log(response.data)
                setImportacoes(response.data)
            })

    }, [update])

    return (
        <>
            <Typography variant='h4' sx={{marginBottom: 5}}>Importações</Typography>
            <Table rows={importacoes} onUpdate={onUpdate} />
        </>

    )
}

export default Importacoes;