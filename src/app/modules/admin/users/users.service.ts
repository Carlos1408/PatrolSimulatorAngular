import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { environment } from "environments/environment";
import { map, take, tap, switchMap, filter } from 'rxjs/operators';
import { User } from "./users.types";

@Injectable({
    providedIn: 'root'
})
export class
UsersService
{
    private _user: BehaviorSubject<User | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
    private _message: BehaviorSubject<string | null> = new BehaviorSubject(null);

    private _new:string = '00000000-0000-0000-0000-000000000000';

    constructor(private _httpClient: HttpClient){}

    get users$(): Observable<User[]>
    {
        return this._users.asObservable();
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    getUsers(): Observable<User[]>
    {
        return this._httpClient.get<User[]>(`${environment.APIurl}/users`)
        .pipe(
            tap((users) => {
                this._users.next(users);
            })
        );
    }

    getUserByKey(id: string): Observable<User>
    {
        if(id === this._new)
        {
            return this._user.pipe(
                take(1),
                map(() => {
                    const user : User = {
                        id : '',
                        name: '',
                        lastName: '',
                        username: '',
                        email: '',
                        password: '',
                        status: 'active',
                        rank: 'est',
                        ffaa: 'ejercito'
                    };
                    this._user.next(user);
                    return user;
                })
            );
        }

        return this._users.pipe(
            take(1),
            map((Users) => {
                const User = Users.find(item => item['id'] ===  id) || null;
                this._user.next(User);
                return User;
            }),
            switchMap((User) => {
                if ( !User )
                {
                    return throwError(`No se pudo encontrar el usuario con la clave ${id}!`);
                }
                return of(User);
            })
        );
    }

    createUser(newUser: User): Observable<User>
    {
        return this.users$.pipe(
            take(1),
            switchMap(users => this._httpClient.post<User>(`${environment.APIurl}/users`, newUser).pipe(
                map((newUser) => {
                    this._users.next([newUser, ...users]);
                    return newUser;
                })
            ))
        )
    }

    updateUser(id: string, _update: User): Observable<User>
    {
        return this.users$.pipe(
            take(1),
            switchMap(users => this._httpClient.put<User>(`${environment.APIurl}/users/${id}`, _update)
            .pipe(
                map((updateUser) => {
                    const index = users.findIndex(item => item['id'] === id);
                    users[index] = updateUser;
                    this._users.next(users);
                    return updateUser;
                }),
                switchMap(updateUser => this.user$.pipe(
                    take(1),
                    filter(item => item && item['id'] === id),
                    tap(() => {
                        this._user.next(updateUser);
                        return updateUser;
                    })
                ))
            ))
        );
    }

    deleteUser(id: string): Observable<boolean>
    {
        return this.users$.pipe(
            take(1),
            switchMap(users => this._httpClient.delete(`${environment.APIurl}/users/${id}`)
            .pipe(
                map((isDeleted: boolean) => {
                    const index = users.findIndex(item => item['id'] === id);
                    users.splice(index, 1);
                    this._users.next(users);
                    return isDeleted;
                })
            ))
        )
    }
}
