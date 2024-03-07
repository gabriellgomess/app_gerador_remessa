import React, { useEffect } from 'react';



const BaixarREM = () => {

    const Header = {
        "codigo_registro": "A",
        "codigo_remessa": "1",
        "codigo_convenio": "1205",
        "nome_empresa": "NEXUSTCH TEC",
        "codigo_banco": "041",
        "nome_banco": "BANRISUL",
        "nsa": "1",
        "versao_layout": "05",
        "identificacao_servico": "DEBITO AUTOMATICO"
    }


    const DadosClientes = [
        {
            "id": 476,
            "nome": "SOLANGE INES FRITZEN",
            "cpf": "90944208053",
            "valor": 49.99,
            "banco": "041",
            "agencia": "1092",
            "conta": "350020450",
            "digito": "4",
            "vencimento": "2006-03-24",
            "cod_proposta_parceiro": null,
            "parceiro": "",
            "created_at": "2024-03-07 14:14:25",
            "importacao_id": "8",
            "status": null
        },
        {
            "id": 477,
            "nome": "NIVALDO BERGJOHANN",
            "cpf": "44250649091",
            "valor": 49.99,
            "banco": "041",
            "agencia": "348",
            "conta": "350024870",
            "digito": "6",
            "vencimento": "2006-03-24",
            "cod_proposta_parceiro": null,
            "parceiro": "",
            "created_at": "2024-03-07 14:14:25",
            "importacao_id": "8",
            "status": null
        },
        {
            "id": 478,
            "nome": "ALICE TEREZINHA DA COSTA FERNANDES",
            "cpf": "41929608004",
            "valor": 49.99,
            "banco": "041",
            "agencia": "27",
            "conta": "350037480",
            "digito": "9",
            "vencimento": "2006-03-24",
            "cod_proposta_parceiro": null,
            "parceiro": "",
            "created_at": "2024-03-07 14:14:25",
            "importacao_id": "8",
            "status": null
        }
    ]

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

    function formatarRegistroZ(DadosClientes) {
        // Z01 - Código do Registro
        const Z01 = 'Z';
        // Z02 - Total de registros do arquivo
        const Z02 = (DadosClientes.length + 2).toString().padStart(6, '0'); // +2 para contar o Header e o Trailer
        // Z03 - Valor total dos registros do arquivo
        const valorTotal = DadosClientes.reduce((acc, cobranca) => acc + cobranca.valor, 0);
        const Z03 = valorTotal.toFixed(2).replace('.', '').padStart(17, '0');
        // Z04 - Reservado para o futuro
        const Z04 = ' '.repeat(126); // Espaços em branco como reservado para o futuro

        // Concatene todos os campos em uma única linha, respeitando as posições
        return `${Z01}${Z02}${Z03}${Z04}`;
    }


    function criarConteudoRem(DadosClientes, Header) {
        const linhas = [];

        // Adicionar o registro "A"
        linhas.push(formatarRegistroA(Header));

        // Adicionar os registros "E" para cada cobrança
        linhas.push(...DadosClientes.map(formatarRegistroE));

        // Adicionar o registro "Z" (trailer)
        linhas.push(formatarRegistroZ(DadosClientes));

        // Juntar todas as linhas com quebra de linha
        return linhas.join('\n');
    }

    function handleDownload() {
        const conteudoArquivo = criarConteudoRem(DadosClientes, Header);
        baixarArquivo(conteudoArquivo, 'arquivo.rem');
    }

    return (
        <>
            <h1>BaixarREM</h1>
            <button onClick={handleDownload}>Baixar Arquivo REM</button>
        </>
    );
};

export default BaixarREM;
