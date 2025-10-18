export interface BasketModel{
    basketId: number,
    toyId:number,
    numOfProd: number,
    userMail: string
    price: number,
    createdAt:string,
    updatedAt:string | null,
    status: 'RESERVED' | 'ARRIVED' | 'CANCELED' 
}