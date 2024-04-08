const Role = require('../config/roles.json');

exports.checkPermission = (permission) => {
    return (req, res, next) => {
        const userRole = req.headers.interface ? req.headers.interface : 'anonymous';

        if (userRole) {
            const role = Role.roles.find(role => role.name === userRole);

            if (role) {
                const permissions = role.permissions;

                if (permissions.includes(permission)) {
                    console.log('Permission granted');
                    return next();
                } else {
                    console.log('Permission denied');
                    return res.status(403).json({ error: 'Permission Denied' });
                }
            } else {
                console.log('Role not found');
                return res.status(403).json({ error: 'Role Not Found' });
            }
        } else {
            console.log('Invalid user role');
            return res.status(403).json({ error: 'Invalid User Role' });
        }
    };
};
