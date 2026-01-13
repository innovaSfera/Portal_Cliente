export interface CustomerResponseDto {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  sexo: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  patologia?: string;
  observacoes?: string;
  status: string;
  dataCadastro: string;
  dataDesativacao?: string;
}
