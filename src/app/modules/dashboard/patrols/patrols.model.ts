import { User } from "app/modules/admin/users/users.types"

export interface Patrol {
    key? : string,
    userKey : string,
    mapKey : string,
    username: string
    user: User
}