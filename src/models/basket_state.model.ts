import { BasketModel } from "./basket.model";

export interface BasketStateModel{
    items: BasketModel[]
    totalPrice: number
    totalItemCount: number
    customerEmail: string | null
    
}