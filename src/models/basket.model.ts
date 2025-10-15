export interface BasketModel{
    toyId:number,
    numOfProd: number,
    price: number,
    createdAt:string,
    updatedAt:string | null,
    status: 'RESERVED' | 'ARRIVED' | 'CANCELED' 
}