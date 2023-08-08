import { Patrol } from "../patrols/patrols.model"

export interface Map {
    id?: string,
    key? : string,
    name : string
    patrols : Patrol[]
}