import  axios from 'axios';
const client = axios.create();
export class MainService {
    static async getAllAdimisionQuestions() {
        return await axios.get('https://fakestoreapi.com/products');
    }
}