import axios from "axios";

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

}