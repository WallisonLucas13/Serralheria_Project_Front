import { Servico } from "./servico"

export interface cliente {

    id: number,
    nome: string,
    tel: string,
    bairro: string,
    endereco: string
    servicos: Servico[]
    
}
