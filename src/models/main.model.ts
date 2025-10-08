import { AddressModel } from './address.model';
export interface MainModel {
  id: Number
  name: String
  age: Number
  email: String
  isStudent: Boolean
  address: AddressModel
}