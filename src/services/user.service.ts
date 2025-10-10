import { first, pairwise } from "rxjs";
import { UserModel } from "../models/user.model";

export class UserService {
    static findUswerByEmail(email: string){
        if (!localStorage.getItem('users'))
            localStorage.setItem('users', JSON.stringify([
                {
                    firstName: 'User',
                    lastName: 'Useric',
                    email:'user@example.com',
                    phone:'+38160123456',
                    password: 'user123',
                    country: 'Serbia',
                    city: 'Belgrade',
                    address: 'Bulevar Mihajla Pupina 10',
                    toy: 'Bayblade',
                    data: []
                }
            ]))
        const user:UserModel[] = JSON.parse(localStorage.getItem('users')!) 
        const exactUser=user.find(u => u.email === email)
        if(!exactUser)
            throw Error('NO_SUCH_USER')
            return user.find(u => u.email === email)
        return exactUser
    }
    static login(email: string, password: string){
        const user=this.findUswerByEmail(email)
        if(user?.password !== password){
           throw Error('BAD_CREDENTIALS')
        }
        localStorage.setItem('active', user.email)
    }

    static getActiveUser(){
        if(!localStorage.getItem('active'))
            throw Error('NO_ACTIVE_USER')
        return this.findUswerByEmail(localStorage.getItem('active')!)
    }
    static logout(){
        localStorage.removeItem('active')
    }   
}