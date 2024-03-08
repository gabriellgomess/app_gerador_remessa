import React, { useState } from "react";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import { Button } from '@mui/material'
import axios from 'axios';
import Swal from 'sweetalert2';

const translations = {
    uploadStep: {
        title: "Carregar arquivo",
        manifestTitle: "Dados que esperamos:",
        manifestDescription: "(Você terá a chance de renomear ou remover colunas nos próximos passos)",
        maxRecordsExceeded: (maxRecords) => `Muitos registros. Até ${maxRecords} permitidos`,
        dropzone: {
            title: "Carregar arquivo .xlsx, .xls ou .csv",
            errorToastDescription: "Carregamento rejeitado",
            activeDropzoneTitle: "Solte o arquivo aqui...",
            buttonTitle: "Selecionar arquivo",
            loadingTitle: "Processando...",
        },
        selectSheet: {
            title: "Selecione a planilha a ser usada",
            nextButtonTitle: "Próximo",
            backButtonTitle: "Voltar",
        },
    },
    selectHeaderStep: {
        title: "Selecionar linha de cabeçalho",
        nextButtonTitle: "Próximo",
        backButtonTitle: "Voltar",
    },
    matchColumnsStep: {
        title: "Corresponder Colunas",
        nextButtonTitle: "Próximo",
        backButtonTitle: "Voltar",
        userTableTitle: "Sua tabela",
        templateTitle: "Se tornará",
        selectPlaceholder: "Selecionar coluna...",
        ignoredColumnText: "Coluna ignorada",
        subSelectPlaceholder: "Selecionar...",
        matchDropdownTitle: "Corresponder",
        unmatched: "Não correspondido",
        duplicateColumnWarningTitle: "Outra coluna não selecionada",
        duplicateColumnWarningDescription: "As colunas não podem se duplicar",
    },
    validationStep: {
        title: "Validar dados",
        nextButtonTitle: "Confirmar",
        backButtonTitle: "Voltar",
        noRowsMessage: "Nenhum dado encontrado",
        noRowsMessageWhenFiltered: "Nenhum dado contendo erros",
        discardButtonTitle: "Descartar linhas selecionadas",
        filterSwitchTitle: "Mostrar apenas linhas com erros",
    },
    alerts: {
        confirmClose: {
            headerTitle: "Sair do fluxo de importação",
            bodyText: "Tem certeza? Suas informações atuais não serão salvas.",
            cancelButtonTitle: "Cancelar",
            exitButtonTitle: "Sair do fluxo",
        },
        submitIncomplete: {
            headerTitle: "Erros detectados",
            bodyText: "Ainda há algumas linhas que contêm erros. As linhas com erros serão ignoradas ao enviar.",
            bodyTextSubmitForbidden: "Ainda há algumas linhas contendo erros.",
            cancelButtonTitle: "Cancelar",
            finishButtonTitle: "Enviar",
        },
        submitError: {
            title: "Erro",
            defaultMessage: "Ocorreu um erro ao enviar os dados",
        },
        unmatchedRequiredFields: {
            headerTitle: "Não todas as colunas correspondidas",
            bodyText: "Existem colunas obrigatórias que não estão correspondidas ou foram ignoradas. Deseja continuar?",
            listTitle: "Colunas não correspondidas:",
            cancelButtonTitle: "Cancelar",
            continueButtonTitle: "Continuar",
        },
        toast: {
            error: "Erro",
        },
    },
};



// Campos configurados para corresponder à planilha.
const fields = [
    {
        label: "Nome",
        key: "nome",
        alternateMatches: ["nome"],
        fieldType: { type: "input" },
        validations: [{ rule: "required", errorMessage: "Nome é obrigatório." }],
    },
    {
        label: "CPF",
        key: "cpf",
        fieldType: { type: "input" },
        validations: [{ rule: "required", errorMessage: "CPF é obrigatório." }],
    },
    {
        label: "Valor",
        key: "valor",
        fieldType: { type: "input" },
        validations: [{ rule: "required", errorMessage: "Valor é obrigatório." }],
    },
    {
        label: "Banco",
        key: "banco",
        fieldType: { type: "input" },
        validations: [{ rule: "required", errorMessage: "Banco é obrigatório." }],
    },
    {
        label: "Agência",
        key: "agencia",
        fieldType: { type: "input" },
        validations: [{ rule: "required", errorMessage: "Agência é obrigatória." }],
    },
    {
        label: "Conta",
        key: "conta",
        fieldType: { type: "input" },
        validations: [{ rule: "required", errorMessage: "Conta é obrigatória." }],
    },
    {
        label: "Dígito",
        key: "digito",
        fieldType: { type: "input" },
        validations: [{ rule: "required", errorMessage: "Dígito é obrigatório." }],
    },
    {
        label: "Vencimento",
        key: "vencimento",
        fieldType: { type: "input" },
        validations: [{ rule: "required", errorMessage: "Vencimento é obrigatório." }],
    },
    {
        label: "Código Proposta Parceiro",
        key: "codigo_proposta_parceiro",
        fieldType: { type: "input" },
    },
];

const Home = ({user}) => {
    // Estado para controlar a visibilidade do modal de importação.
    const [isOpen, setIsOpen] = useState(false);

    // Função para abrir o modal.
    const handleOpen = () => setIsOpen(true);

    // Função para fechar o modal.
    const onClose = () => setIsOpen(false);

    // Função para lidar com o envio dos dados importados.
    const onSubmit = (data) => {

        const importacao = {
            ...data,
            dadosImportacao: user
        }
        
        // Aqui você pode processar os dados importados conforme necessário.
        axios.post('https://rem.nexustech.net.br/api_rem/importa_dados.php', importacao)
            .then((response) => {                
                if(response.data.success){
                     Swal.fire({
                    title: response.data.message,
                    text: `Foram inseridos ${response.data.linhasAfetadas} registros na importação nº ${response.data.importacaoId}, totalizando ${new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    }).format(response.data.valorTotal)}`,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                  })
                }else{
                    Swal.fire({
                        title: 'Error!',
                        text: 'Ocorreu um erro na importação',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                      })
                }
               
            }, (error) => {
                console.log(error);
            });
    };

    return (
        <>
            <Button variant="contained" onClick={handleOpen}>Importar Dados</Button>
            <ReactSpreadsheetImport
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={onSubmit}
                fields={fields}
                translations={translations}
            />
        </>
    );
};

export default Home;
