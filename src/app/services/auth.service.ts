import { Injectable } from '@angular/core';

import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Store } from '@ngrx/store';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;

  constructor(public auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store) { }

  initAuthListener() {

    this.auth.authState.subscribe(fuser => {
      if (fuser) {
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe((firestoreUser: any) => {
            console.log(firestoreUser);
            const user = Usuario.fromFirebase(firestoreUser);
            this.store.dispatch(authActions.setUser({ user }));
          });

      } else {
        this.userSubscription.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
      }
    })

  }



  crearUsuario(nombre: string, email: string, password: string) {

    // console.log({ nombre, email, password });
    try {
      return this.auth.createUserWithEmailAndPassword(email, password)
        .then(({ user }) => {
          console.log('createUserWithEmailAndPassword OK', user);
          const newUser = new Usuario(user.uid, nombre, user.email);

          return this.firestore.doc(`${user.uid}/usuario`).set({ ...newUser });

        })
        .catch(err => {
          console.log('error creando usuario', err);
        });

    } catch (error) {
      console.log('errrrrrr', error);
    }

  }

  loginUsuario(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map(fbUser => fbUser != null)
    );
  }

}
