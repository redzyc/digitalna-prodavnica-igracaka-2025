export interface BasketModel{
    toyId:number,
    numOfProd: number,
    createdAt:string,
    updatedAt:string | null,
    status: 'RESERVED' | 'ARRIVED' | 'CANCELED' 
}