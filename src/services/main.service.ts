import axios from "axios";
export class MainService {
    static async getToys(){
        return axios.get('/toys.json');
    }
}

