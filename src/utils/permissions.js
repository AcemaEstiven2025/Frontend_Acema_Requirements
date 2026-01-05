import { PERMISSIONS } from "@/config/Roles";

// export const hasPermission = (role, permission) => {
//   if (!permission) return true; // si no hay restricción, todos pueden
//   if (!role) return false;      // si no hay rol, denegar

//   const cleanRole = role?.trim().toUpperCase();

//   // si la permission es "*" cualquiera puede
//   if (permission.includes("*")) return true;

//   // si permission es array de roles
//   const permArray = Array.isArray(permission) ? permission : [permission];

//   return permArray.some((p) => p.trim().toUpperCase() === cleanRole);
// };

export const hasPermission = (role, permissions) => {
  if (!permissions) return true; // si no hay permisos, todos pueden
  if (!role) return false; // si no hay rol, no puede

  const cleanRole = role.trim().toUpperCase();

  // convertir a array si no lo es
  const perms = Array.isArray(permissions) ? permissions : [permissions];

  // recorrer todos los permisos (puede ser un array de strings o arrays)
  return perms.some((perm) => {
    if (Array.isArray(perm)) {
      // si es un array, revisa si el rol está dentro
      return perm.some((p) => p.trim().toUpperCase() === cleanRole);
    } else {
      return perm.trim().toUpperCase() === cleanRole;
    }
  });
};
