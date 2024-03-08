import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArticleIcon from '@mui/icons-material/Article';
import { IconButton } from '@mui/material';

import { HEADER } from '../components/Config';



function baixarArquivo(conteudo, nomeArquivo) {
    const blob = new Blob([conteudo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function formatarRegistroA(header) {
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear().toString();
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0'); // getMonth() retorna 0-11
    const dia = dataAtual.getDate().toString().padStart(2, '0');

    const A01 = header.codigo_registro;
    const A02 = header.codigo_remessa;
    const A03 = header.codigo_convenio.padStart(5, '0');
    const A03_1 = ' '.repeat(15);
    const A04 = header.nome_empresa.padEnd(20, ' ');
    const A05 = header.codigo_banco.padStart(3, '0');
    const A06 = header.nome_banco.padEnd(20, ' ');
    const A07 = `${ano}${mes}${dia}`// A data de geração será inserida quando o arquivo for gerado
    const A08 = header.nsa.padStart(6, '0');
    const A09 = header.versao_layout.padStart(2, '0');
    const A10 = header.identificacao_servico.padEnd(17, ' ');
    const A11 = ' '.repeat(52); // Espaços reservados para o futuro

    // Concatene todos os campos em uma única linha, respeitando as posições
    return `${A01}${A02}${A03}${A03_1}${A04}${A05}${A06}${A07}${A08}${A09}${A10}${A11}`;
}

function formatarRegistroE(cobranca) {
    const E01 = 'E';
    const E02 = cobranca.id.toString().padStart(25, '0'); // Identificação do Cliente na Empresa
    const E03 = cobranca.agencia.padStart(4, '0'); // Agência para Débito
    const E04 = cobranca.conta.padStart(10, '0'); // Identificação do Cliente no Banco
    const E04_1 = ' '.repeat(4);
    const E05 = cobranca.vencimento.replace(/-/g, ''); // Data de Vencimento
    const E06 = (cobranca.valor.toFixed(2).replace('.', '').padStart(15, '0')); // Valor do Débito
    const E07 = '03';
    const E08 = ' '.repeat(60);
    const E09 = '2'; // 1 = CNPJ e 2 = CPF
    const E10 = cobranca.cpf.padStart(15, '0');
    const E11 = ' '.repeat(4);
    const E12 = '0'; // 0 = Débito Normal e 1 = Cancelamento (exclusão) de lançamento enviado anteriormente para o Banco. O cancelamento só será efetuado, desde que o débito ainda não tenha sido efetivado.        

    // Concatene todos os campos em uma única linha, respeitando as posições
    return `${E01}${E02}${E03}${E04}${E04_1}${E05}${E06}${E07}${E08}${E09}${E10}${E11}${E12}`;
}

function formatarRegistroZ(importacaoClientes) {
    // Z01 - Código do Registro
    const Z01 = 'Z';
    // Z02 - Total de registros do arquivo
    const Z02 = (importacaoClientes.length + 2).toString().padStart(6, '0'); // +2 para contar o HEADER e o Trailer
    // Z03 - Valor total dos registros do arquivo
    const valorTotal = importacaoClientes.reduce((acc, cobranca) => acc + cobranca.valor, 0);
    const Z03 = valorTotal.toFixed(2).replace('.', '').padStart(17, '0');
    // Z04 - Reservado para o futuro
    const Z04 = ' '.repeat(126); // Espaços em branco como reservado para o futuro

    // Concatene todos os campos em uma única linha, respeitando as posições
    return `${Z01}${Z02}${Z03}${Z04}`;
}

function criarConteudoRem(importacaoClientes, HEADER) {
    const linhas = [];

    // Adicionar o registro "A"
    linhas.push(formatarRegistroA(HEADER));

    // Adicionar os registros "E" para cada cobrança
    linhas.push(...importacaoClientes?.map(formatarRegistroE));

    // Adicionar o registro "Z" (trailer)
    linhas.push(formatarRegistroZ(importacaoClientes));

    // Juntar todas as linhas com quebra de linha
    return linhas.join('\r\n');
}

function useClientes(id) {
    const [importacaoClientes, setImportacaoClientes] = useState([]);

    const buscaClientes = async () => {
        try {
            const { data } = await axios.post('https://rem.nexustech.net.br/api_rem/busca_clientes.php', { id });
            setImportacaoClientes(data.dadosClientes);
        } catch (error) {
            console.error("Erro na solicitação: ", error);
        }
    };

    return [importacaoClientes, buscaClientes];
}

const BaixarREM = ({ row }) => {
    const [importacaoClientes, buscaClientes] = useClientes(row.id);

    useEffect(() => {
        // Esta função será chamada automaticamente quando o estado importacaoClientes mudar.
        if (importacaoClientes.length > 0) {
            const conteudoArquivo = criarConteudoRem(importacaoClientes, HEADER);
            baixarArquivo(conteudoArquivo, 'arquivo.rem');
        }
    }, [importacaoClientes]); // Dependências: a função é chamada novamente sempre que importacaoClientes mudar.

    return (
        <>
            <IconButton onClick={buscaClientes}>
                <ArticleIcon />
            </IconButton>
        </>
    );
};

export default BaixarREM;
