import { Material } from "./material";

export interface Servico{
    id: number,
    nome: string,
    desc: string,
    materiais: Material[]
}