export interface BranchOfficeResponseDto {
  id: string;
  nomeFilial: string;
  observacao?: string;
  matriz: boolean;
  idGerenteFilial?: string;
  endereco?: {
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
  dataCadastro?: string;
  ativo?: boolean;
}
