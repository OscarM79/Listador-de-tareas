import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TareasService } from '../../services/tareas.service';
import Swal from 'sweetalert2';
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
      nombre: [''],
      descripcion: ['']
     })
  }

  ngOnInit():void{
    this.getTareas();
  }
  //Metodo de agregaaar o editar tarea
  agregarEditarTarea(){
    const datosTarea:any ={
      nombre: this.crearTarea.value.nombre,
      descripcion: this.crearTarea.value.descripcion
    }
    if(this.crearTarea.value.nombre){  
      this.submitted = false;  
    if(this.id === ""){
      this.agregarTarea(datosTarea);
    }else{
      this.actualizarTarea(this.id,datosTarea);
    }
    }else{
      this.submitted=true;
    }
  }
  //Guardar nueva tarea
  agregarTarea(crtTarea:any){
    this._tareas.agregarTarea(crtTarea).then (() =>{
      this.mensajeExito('Tarea agregada');
    }).catch(error =>{
      this.mensajeError();
    });
  }

  //Actualizar datos de tarea
  actualizarTarea(id:string,actTarea:any){
    this._tareas.actualizarTarea(id,actTarea).then(()=>{
      this.mensajeExito('Datos actualizados');
    }).catch(error=>{
      this.mensajeError();
    });
    this.id = "";
    this.btnAgregar = "Agregar tarea";    
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
  eliminarT(id: string,titulo:string){
    //Mensaje de confirmacion emergente
    Swal.fire({
      title: '¿Seguro en eliminar?',
      text: "Eliminar tarea "+titulo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'SI!'
    }).then((result) => {
      if (result.isConfirmed) {
        //Proceso de borrar dato en firebase
        this._tareas.eliminarTarea(id).then(()=>{
          this.mensajeExito('Tarea eliminada');
        }).catch(error =>{
          this.mensajeError();
        })
      }
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
//Mensaje de exito
  mensajeExito(mensaeje:string){
    Swal.fire(
            mensaeje,
            '',
            'success'
          )
  }
  //Mensaje de error
  mensajeError(){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Se produjo un error'
    })
  }
}
