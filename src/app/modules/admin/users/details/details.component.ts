import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDrawerToggleResult } from "@angular/material/sidenav";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { MyErrorStatusMatcher } from "app/shared/error-status-matcher";
import { Subject, throwError } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { UsersListComponent } from "../list/list.component";
import { UsersService } from "../users.service";
import { User } from "../users.types";


@Component({
    selector: 'areas-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersDetailsComponent implements OnInit, OnDestroy {

    _query: string = '';
    editMode: boolean = false;
    users: User[];
    user: User;

    userForm: FormGroup;
    matcher = new MyErrorStatusMatcher();
    showPassword: boolean = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _snackBar: MatSnackBar,
        private _usersListComponent: UsersListComponent,
        private _userService: UsersService
    ) { }

    ngOnInit(): void
    {
        this._usersListComponent.matDrawer.open();

        this.userForm = this._formBuilder.group({
            key: [''],
            id: [''],
            username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15),  Validators.pattern("^[a-zA-ZÀ-ú0-9 ñ '&() .,-]*$")]],
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern("^[a-zA-ZÀ-ú0-9 ñ '&() .,-]*$")]],
            lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern("^[a-zA-ZÀ-ú0-9 ñ '&() .,-]*$")]],
            ffaa: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern("^[a-zA-ZÀ-ú0-9 ñ '&() .,-]*$")]],
            rank: ['', [Validators.maxLength(20)]],
            email: ['', [Validators.maxLength(50), Validators.email]],
            password: [''],
            status: ['active', [Validators.required]]
        });

        this._userService.users$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((Users: User[]) => {
                this.users = Users;
                this._changeDetectorRef.markForCheck();
            });

        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((User: User) => {
                this._usersListComponent.matDrawer.open();
                this.user = User;

                this.userForm.patchValue(User);
                
                this.toggleEditMode(User.key ? false : true);
                this._changeDetectorRef.markForCheck();
            });

        if(this._usersListComponent.searchInputControl.value != undefined)
        {
            this._query = this._usersListComponent.searchInputControl.value;
        }
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    closeDrawer(): Promise<MatDrawerToggleResult>{
        return this._usersListComponent.matDrawer.close();
    }

    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        }
        else {
            this.editMode = editMode;
        }

        if (!this.editMode && !this.user.key) {
            this._router.navigate(['../'], { relativeTo: this._activatedRoute });
        }

        this._changeDetectorRef.markForCheck();
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    deleteUser() {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar Usuario',
            message: 'Estas seguro de que quieres eliminar este usuario? Esta acción no tiene Retroceso!',
            actions: {
                confirm: {
                    label: 'Eliminar'
                },
                cancel: {
                    label: 'Cancelar'
                }
            }
        });

        confirmation.afterClosed().subscribe((result) => {
            if(result === 'confirmed')
            {
                const id = this.user.id;
                const currentUserIndex = this.users.findIndex(item => item['id'] === id);
                const nextUserIndex = currentUserIndex + ((currentUserIndex === (this.users.length - 1)) ? -1 : 1);
                const nextUserId = (this.users.length === 1 && this.users[0].id === id) ? null : this.users[nextUserIndex].id;

                this._userService.deleteUser(id)
                    .pipe(
                        catchError((error) => {
                            this.snackBar(error)
                            return throwError(error);
                        })
                    )
                    .subscribe((isDeleted) => {
                        if (!isDeleted) {
                            return;
                        }
                        if (nextUserId) {
                            this._router.navigate(['../', nextUserId], { relativeTo: this._activatedRoute });
                        }
                        else {
                            this._router.navigate(['../'], { relativeTo: this._activatedRoute });
                        }

                        this._userService.getUsers().subscribe();
                        this.snackBar('Usuario eliminado correctamente');
                        this.toggleEditMode(false);
                    });

                this._changeDetectorRef.markForCheck();
            }
        })
    }

    updateUser(): void {
        const _update = this.userForm.getRawValue();

        if (_update.id === '') {
            this._userService.createUser(_update)
                .pipe(
                    catchError((error) => {
                        this.snackBar(error);
                        return throwError(error);
                    })
                )
                .subscribe((User) => {
                    this.user = User;
                    this.toggleEditMode(false);
                    this._router.navigate(['../', this.user.id], { relativeTo: this._activatedRoute });
                    this.snackBar('Nuevo Usuario Agregado Correctamente');
                });
        }
        else
        {
            this._userService.updateUser(_update.id, _update)
                .pipe(
                    catchError((error) => {
                        this.snackBar(error);
                        return throwError(error);
                    })
                )
                .subscribe(() => {
                    this.toggleEditMode(false);
                    this._userService.getUsers().subscribe();

                    this.snackBar('Usuario Modificado Correctamente');
                });
        }
    }
    
    setStatus(status): void {
        this.userForm.get('status').setValue(status);
        this.user.status = status;
    }

    snackBar(message) {
        this._snackBar.open(message, '', {
            duration: 3000,
            verticalPosition: 'bottom',
            panelClass: ['bg-blue-800', 'font-bold', 'text-gray-100']
        });
    }

    trackByFn(index: number, item: any): any
    {
        return item.Key || index;
    }
}