import { first, pairwise } from "rxjs";
import { UserModel } from "../models/user.model";

export class UserService {
    static getUsers(): UserModel[] {
        if (!localStorage.getItem('users'))
            localStorage.setItem('users', JSON.stringify([
                {
                    firstName: 'User',
                    lastName: 'Useric',
                    email: 'user@example.com',
                    phone: '+38160123456',
                    password: 'user123',
                    country: 'Serbia',
                    city: 'Belgrade',
                    address: 'Bulevar Mihajla Pupina 10',
                    toy: 'Bayblade',
                    data: []
                }
            ]))
        return JSON.parse(localStorage.getItem('users')!)
    }

    static findUserByEmail(email: string) {
        if (!localStorage.getItem('users'))
            localStorage.setItem('users', JSON.stringify([
                {
                    firstName: 'User',
                    lastName: 'Useric',
                    email: 'user@example.com',
                    phone: '+38160123456',
                    password: 'user123',
                    country: 'Serbia',
                    city: 'Belgrade',
                    address: 'Bulevar Mihajla Pupina 10',
                    toy: 'Bayblade',
                    data: []
                }
            ]))
        const user: UserModel[] = this.getUsers()
        const exactUser = user.find(u => u.email === email)
        if (!exactUser)
            throw Error('NO_SUCH_USER')
        return user.find(u => u.email === email)
        return exactUser
    }
    static login(email: string, password: string) {
        const user = this.findUserByEmail(email)
        if (user?.password !== password) {
            throw Error('BAD_CREDENTIALS')
        }
        localStorage.setItem('active', user.email)
    }
    static singup(playload: UserModel) {
        const users: UserModel[] = this.getUsers()
        users.push(playload)
        localStorage.setItem('users', JSON.stringify(users))
        this.login(playload.email, playload.password)
    }

    static getActiveUser() {
        if (!localStorage.getItem('active'))
            throw Error('NO_ACTIVE_USER')
        return this.findUserByEmail(localStorage.getItem('active')!)
    }
    static createReservation(id: number, numOfProd: number) {
        const active = this.getActiveUser()

        const users = this.getUsers()
        users.forEach(u => {
            if (u.email === active?.email) {
                u.data.push({
                    toyId: id,
                    numOfProd,
                    status: 'waiting',
                    createdAt: new Date().toISOString(),
                    updatedAt: null
                })
            }
        })
        localStorage.setItem('users',JSON.stringify(users))

    }
    static logout() {
        localStorage.removeItem('active')
    }
}