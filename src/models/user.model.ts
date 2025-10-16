import { BasketModel } from "./basket.model"
import { ToyModel } from "./toy.model"

export interface UserModel {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    country: string
    city: string
    address: string
    toy: ToyModel
    data: BasketModel[]
}