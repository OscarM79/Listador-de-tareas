import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TareasComponent } from './components/tareas/tareas.component';

const routes: Routes = [
  {path: '',redirectTo: 'lista-tarea',pathMatch:'full'},
  {path: 'lista-tarea',component: TareasComponent},
  {path: '**',redirectTo: 'lista-tarea',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
