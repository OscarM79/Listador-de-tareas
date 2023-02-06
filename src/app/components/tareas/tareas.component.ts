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
  id:string = "";
  btnAgregar:string = "Agregar tarea";
  habilitar:boolean = true;
  

  constructor(private fb: FormBuilder, 
      private _tareas: TareasService,
      private aRoute: ActivatedRoute,
      private router: Router){
      this.crearTarea = this.fb.group({
      nombre: ['',Validators.required],
      descripcion: ['']
     })
  }

  ngOnInit():void{
    this.getTareas();
  }
  agregarEditarTarea(){
    this.submitted = true;
    const datosTarea:any ={
      nombre: this.crearTarea.value.nombre,
      descripcion: this.crearTarea.value.descripcion
    }
    if(this.crearTarea.invalid){
      return
    }
    if(this.id === ""){
      this.agregarTarea(datosTarea);
    }else{
      this.actualizarTarea(this.id,datosTarea);
    }
    this.crearTarea.reset();
  }
  //Guardar nueva tarea
  agregarTarea(crtTarea:any){
    this._tareas.agregarTarea(crtTarea).then (() =>{
      return
    }).catch(error =>{
      console.log(error);
    });
    this.crearTarea.reset();
  }

  //Actualizar datos de tarea
  actualizarTarea(id:string,actTarea:any){
    console.log(this.id);
    
    this._tareas.actualizarTarea(id,actTarea).then(()=>{
      console.log("Datos actualizados");
    });
    this.id = "";
    this.btnAgregar = "Agregar tarea";
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

  //Eliminar tarea
  eliminarT(id: string){
    this._tareas.eliminarTarea(id).then(()=>{
      console.log('Tarea eliminada');
    }).catch(error =>{
      console.log(error);
    })
  }

  //Editar tarea
  editarTarea(id:string){
    this.btnAgregar = "Actualizar tarea";
    this.id = id;
      this._tareas.getTarea(id).subscribe(data =>{
        this.crearTarea.setValue({
          nombre: data.payload.data()['nombre'],
          descripcion: data.payload.data()['descripcion']
        })
      });     
  }

}
