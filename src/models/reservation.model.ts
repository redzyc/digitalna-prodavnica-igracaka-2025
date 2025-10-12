export interface ReservationModel{
    toyId:number,
    numOfProd: number,
    createdAt:string,
    updatedAt:string | null,
    status: 'paid' | 'waiting' | 'canceled' | 'liked' |'disliked'
}