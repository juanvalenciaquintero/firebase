import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  db = getFirestore();

  constructor(private angularFirestore: AngularFirestore) { }

    public insertar(coleccion, datos) {
    const docRef = setDoc(doc(this.db, coleccion,datos.token), {
      token: datos.token
    });
    return docRef;
  }
}
