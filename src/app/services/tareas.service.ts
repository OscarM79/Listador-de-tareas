import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  constructor(private firestore:AngularFirestore) { }

  agregarTarea(tarea:any): Promise<any>{
    return this.firestore.collection('tareas').add(tarea)
  }

  getTareas(): Observable<any>{
    return this.firestore.collection('tareas').snapshotChanges();
  }

  eliminarTarea(id:string){
    return this.firestore.collection('tareas').doc(id).delete();
  }

  getTarea(id: string): Observable<any>{
    return this.firestore.collection('tareas').doc(id).snapshotChanges();
  }

  actualizarTarea(id:string,data:any): Promise<any>{
    return this.firestore.collection('tareas').doc(id).update(data);
  }
}
