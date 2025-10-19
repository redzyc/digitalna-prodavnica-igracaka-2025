import axios from "axios";
import { ReviewModel } from "../models/review.model";
import { ToyModel } from "../models/toy.model";

const client = axios.create({
    baseURL: 'https://toy.pequla.com/api',
    validateStatus: (status: number) => status === 200,
    headers: {
        'Accept': 'application/json',
        'X-Name': 'TS2025'

    }
})
export class ToyService {
    static async getToys() {
        return await client.get('/toy')
    }
    static async getToyTypes() {
        return await client.get('/type')
    }
    static async getAgeGroup() {
        return await client.get('/age-group ')
    }
    static async getToyById(id: number) {
        return await client.get(`/toy/${id}`)
    }



}