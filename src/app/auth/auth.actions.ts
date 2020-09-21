import { createAction, props } from '@ngrx/store';
import { Usuario } from '../../../../04-ingresoEgresoApp/src/app/models/usuario.model';

export const setUser = createAction(
  '[Auth] setUser',
  props<{ user: Usuario }>()
);

export const unSetUser = createAction(
  '[Auth] unSetUser'
);
