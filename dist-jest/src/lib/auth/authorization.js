export var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["APP_ADMIN"] = "APP_ADMIN";
    UserRole["COMPLEX_ADMIN"] = "COMPLEX_ADMIN";
    UserRole["RESIDENT"] = "RESIDENT";
    UserRole["STAFF"] = "STAFF";
})(UserRole || (UserRole = {}));
export class AuthorizationService {
    /**
     * Verificar si un usuario tiene un rol específico
     * @param user Usuario
     * @param allowedRoles Roles permitidos
     */
    static checkRoleAccess(user, allowedRoles) {
        return allowedRoles.includes(user.role);
    }
    /**
     * Verificar si un usuario puede acceder a un recurso de un conjunto específico
     * @param user Usuario
     * @param resourceComplexId ID del conjunto del recurso
     */
    static canAccessComplex(user, resourceComplexId) {
        // Administradores de la aplicación pueden acceder a todo
        if (user.role === UserRole.APP_ADMIN)
            return true;
        // Administradores de conjunto solo acceden a su conjunto
        if (user.role === UserRole.COMPLEX_ADMIN) {
            return user.complexId === resourceComplexId;
        }
        // Usuarios regulares solo acceden a su propio conjunto
        return user.complexId === resourceComplexId;
    }
    /**
     * Verificar si un usuario puede realizar una acción específica
     * @param user Usuario
     * @param action Acción a realizar
     * @param resourceComplexId ID del conjunto del recurso
     */
    static canPerformAction(user, action, resourceComplexId) {
        // Verificar primero el acceso al conjunto
        if (!this.canAccessComplex(user, resourceComplexId)) {
            return false;
        }
        // Definir permisos basados en roles y acciones
        const rolePermissions = {
            [UserRole.APP_ADMIN]: ['ALL'],
            [UserRole.COMPLEX_ADMIN]: [
                'CREATE_PQR',
                'UPDATE_PQR',
                'VIEW_PQR',
                'MANAGE_PQR'
            ],
            [UserRole.STAFF]: [
                'VIEW_PQR',
                'UPDATE_PQR'
            ],
            [UserRole.RESIDENT]: [
                'CREATE_PQR',
                'VIEW_OWN_PQR'
            ],
            [UserRole.USER]: [
                'CREATE_PQR',
                'VIEW_OWN_PQR'
            ],
            [UserRole.ADMIN]: ['ALL']
        };
        const userPermissions = rolePermissions[user.role] || [];
        return userPermissions.includes('ALL') ||
            userPermissions.includes(action);
    }
}
