import { Role } from "src/common/enums/role.enum";


export const RolesConfig = {
    [Role.Admin]: {
        permissions: [
            'create',
            'read',
            'update',
            'delete'
        ]
    },
    [Role.Organizer]: {
        permissions: [
            'create',
            'read',
            'update',
        ]
    },
    [Role.Reader]: {
        permissions: [
            'read'
        ]
    }
}

export const AccessControl = {
    UsersController:[],
}