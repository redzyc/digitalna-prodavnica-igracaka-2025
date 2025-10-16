
import { UserModel } from "../models/user.model";
import { ToyService } from "./toy.service";

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
        const users: UserModel[] = this.getUsers()
        const exactUser = users.find(u => u.email === email)
        if (!exactUser) throw Error('NO_SUCH_USER')
        return exactUser
    }

    static login(email: string, password: string) {
        const user = this.findUserByEmail(email)
        if (user?.password !== password) throw Error('BAD_CREDENTIALS')
        localStorage.setItem('active', user.email)
    }

    static singup(playload: UserModel) {
        const users: UserModel[] = this.getUsers()
        users.push(playload)
        localStorage.setItem('users', JSON.stringify(users))
        this.login(playload.email, playload.password)
    }

    static getActiveUser() {
        if (!localStorage.getItem('active')) throw Error('NO_ACTIVE_USER')
        return this.findUserByEmail(localStorage.getItem('active')!)
    }

    static async createReservation(id: number, numOfProd: number) {
        const active = this.getActiveUser()
        const users = this.getUsers()
        const response = await ToyService.getToyById(id);
        const toy = response.data;

        users.forEach(u => {
            if (u.email === active?.email) {
                u.data.push({
                    toyId: id,
                    numOfProd,
                    price: toy.price,
                    status: 'RESERVED',
                    createdAt: new Date().toISOString(),
                    updatedAt: null
                })
            }
        })
        localStorage.setItem('users', JSON.stringify(users))
    }

    static logout() {
        localStorage.removeItem('active')
    }

    static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        const active = this.getActiveUser()
        if (!active) throw Error('NO_ACTIVE_USER')


        if (active.password !== currentPassword) throw Error('BAD_CURRENT_PASSWORD')

        const users = this.getUsers()
        const updatedUsers = users.map(u => {
            if (u.email === active.email) {
                return { ...u, password: newPassword }
            }
            return u
        })

        localStorage.setItem('users', JSON.stringify(updatedUsers))
    }
}
