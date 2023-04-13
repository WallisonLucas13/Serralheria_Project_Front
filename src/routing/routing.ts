import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "src/app/Auth/login/login.component";
import { CadastroComponent } from "src/app/cadastro/cadastro.component";
import { clienteDetailsComponent } from "src/app/cliente-details/cliente-details.component";
import { clientesComponent } from "src/app/clientes/clientes.component";
import { HomeComponent } from "src/app/home/home.component";
import { ServicoDetailsComponent } from "src/app/servico-details/servico-details.component";

const ROUTES: Routes = [
    {path: '', component: HomeComponent},
    {path: 'user/login', component: LoginComponent},
    {path: 'clientes', component: clientesComponent},
    {path: 'cadastro', component: CadastroComponent},
    {path: 'cliente/details/',component: clienteDetailsComponent},
    {path: 'cliente/details',component: clienteDetailsComponent},
    {path: 'servico/details/', component: ServicoDetailsComponent},
    {path: 'servico/details', component: ServicoDetailsComponent}
]

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(ROUTES);