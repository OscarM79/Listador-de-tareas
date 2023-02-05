import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TareasService } from '../../services/tareas.service';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent {
  crearTarea: FormGroup;
  submitted = false;
  loading = false;
  listaTarea:any[] = [];
  id: string | null;
  btnAgregar = "Agregar tarea";
  

  constructor(private fb: FormBuilder, 
      private _tareas: TareasService,
      private aRoute: ActivatedRoute,
      private router: Router){
    this.crearTarea = this.fb.group({
      nombre: ['',Validators.required],
      descripcion: ['']
     });
     this.id = this.aRoute.snapshot.paramMap.get('id');     
  }

  ngOnInit():void{
    this.getTareas();
  }
  agregarEditarTarea(){
    this.submitted = true;
    if(this.crearTarea.invalid){
      return
    }
    if(this.id === null){
      this.agregarTarea();
    }else{
      console.log('editar');
      this.actualizarTarea(this.id);
    }

  }
  //Guardar nueva tarea
  agregarTarea(){
    const crtTarea:any ={
      nombre: this.crearTarea.value.nombre,
      descripcion: this.crearTarea.value.descripcion
    }
    this._tareas.agregarTarea(crtTarea).then (() =>{
      return
    }).catch(error =>{
      console.log(error);
    });
    this.crearTarea.reset();
  }

  //Actualizar datos de tarea
  actualizarTarea(id:string){
    console.log(this.id);
    const actTarea:any ={
      nombre: this.crearTarea.value.nombre,
      descripcion: this.crearTarea.value.descripcion
    }
    this._tareas.actualizarTarea(id,actTarea).then(()=>{
      console.log("Datos actualizados");
    });
    this.router.navigate(['/lista-tarea'])
  }
  //Obtener lista de tareas
  getTareas(){
    this.loading = true;
    this._tareas.getTareas().subscribe(data =>{
      this.listaTarea =[];
      data.forEach((element:any) => {
        this.listaTarea.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
    });
  }

  eliminarT(id: string){
    this._tareas.eliminarTarea(id).then(()=>{
      console.log('Tarea eliminada');
    }).catch(error =>{
      console.log(error);
    })
  }

  editarTarea(){
    this.btnAgregar = "Actualizar tarea";
    if(this.id !=null){
      this._tareas.getTarea(this.id).subscribe(data =>{
        this.crearTarea.setValue({
          nombre: data.payload.data()['nombre'],
          descripcion: data.payload.data()['descripcion']
        }),
        console.log(data.payload.data()['nombre'])
      })
    }
  }

}
