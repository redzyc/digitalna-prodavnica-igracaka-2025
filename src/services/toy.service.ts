import axios from "axios";
import { ReviewModel } from "../models/review.model";
import { ToyModel } from "../models/toy.model";

const client =axios.create({
    baseURL:'https://toy.pequla.com/api',
    validateStatus:(status :number ) =>status ===200,
    headers:{
        'Accept':'application/json',
        'X-Name':'TS2025'

    }
})
export class ToyService{
    static async getToys(){
        return await client.get('/toy')
    }
    static async getToyById(id:number){
        return await client.get(`/toy/${id}`)
    }
    static  async addReview(toy: ToyModel, review: ReviewModel) {
        const t = this.getToyById(toy.toyId)

        if (await t) {
            toy.reviews.push(review);
            console.log(`Review added locally to toy: ${toy.name}`);
        } else {
            console.error(`Toy ID ${t} not found in local state to add review.`);
        }
    }

}