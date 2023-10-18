/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';
import { environment } from 'environments/environment';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboards',
        subtitle: 'Panel de reportes del simulador',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'dashboard.maps',
                title: 'Panel de Control',
                type: 'basic',
                icon: 'heroicons_outline:chart-square-bar',
                link: 'dashboard/maps',
            },
        ],
    },
    {
        id: 'admin',
        title: 'Administracion',
        subtitle: 'Area de administracion',
        type: 'group',
        icon: 'heroicons_outline:cog',
        children: [
            {
                id: 'users',
                title: 'Usuarios',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: 'admin/users',
            },
        ],
    },
    {
        id: 'reports',
        title: 'Reportes',
        subtitle: 'Generación de reportes',
        type: 'group',
        icon: 'heroicons_outline:cog',
        children: [
            {
                id: 'reportPatrols',
                title: 'Patrullajes',
                type: 'basic',
                icon: 'heroicons_outline:book-open',
                link: `${environment.APIurl}/reports/patrols`,
                externalLink: true,
            },
            {
                id: 'reportRecognitions',
                title: 'Reconocimientos',
                type: 'basic',
                icon: 'heroicons_outline:book-open',
                link: `${environment.APIurl}/reports/recognitions`,
                externalLink: true,
            },
            {
                id: 'reportAmbushes',
                title: 'Emboscadas',
                type: 'basic',
                icon: 'heroicons_outline:book-open',
                link: `${environment.APIurl}/reports/ambushes`,
                externalLink: true,
            },
            {
                id: 'reportCombats',
                title: 'Combates',
                type: 'basic',
                icon: 'heroicons_outline:book-open',
                link: `${environment.APIurl}/reports/combats`,
                externalLink: true,
            },
        ],
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        link: 'dashboard',
        icon: 'heroicons_outline:chart-square-bar',
    },
    {
        id: 'admin',
        title: 'Administracion',
        subtitle: 'Area de administracion de catalogos',
        type: 'group',
        icon: 'heroicons_outline:cog',
        children: [],
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        link: 'dashboard',
        icon: 'heroicons_outline:chart-square-bar',
    },
    {
        id: 'admin',
        title: 'Administracion',
        subtitle: 'Area de administracion de catalogos',
        type: 'group',
        icon: 'heroicons_outline:cog',
        children: [],
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        link: 'dashboard',
        icon: 'heroicons_outline:chart-square-bar',
    },
    {
        id: 'admin',
        title: 'Administracion',
        subtitle: 'Area de administracion de catalogos',
        type: 'group',
        icon: 'heroicons_outline:cog',
        children: [],
    },
];
