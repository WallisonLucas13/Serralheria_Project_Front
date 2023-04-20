import { FormaPagamento } from "./FormaPagamento";

export default interface Entrada{
    porcentagem: number,
    valor: number,
    formaPagamento: FormaPagamento
}