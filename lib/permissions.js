import { supabase } from './supabaseClient';

/**
 * Récupère les permissions actives de l'utilisateur authentifié.
 *
 * Retourne :
 * - profile : profil utilisateur actif ;
 * - permissions : liste des codes de permissions autorisées.
 *
 * Une erreur de vérification provoque un refus d'accès.
 */
export async function getUserPermissions() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Utilisateur non authentifié.');
  }

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select(`
      id,
      nom_complet,
      email,
      role_id,
      commercial_id,
      actif,
      roles (
        id,
        code,
        nom,
        actif
      )
    `)
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error('Impossible de vérifier le profil utilisateur.');
  }

  if (!profile || !profile.actif) {
    throw new Error('Profil absent ou inactif.');
  }

  const role = Array.isArray(profile.roles)
    ? profile.roles[0]
    : profile.roles;

  if (!role || !role.actif) {
    throw new Error('Rôle absent ou inactif.');
  }

  const { data: rolePermissions, error: permissionsError } = await supabase
    .from('role_permissions')
    .select(`
      permissions (
        code,
        actif
      )
    `)
    .eq('role_id', role.id);

  if (permissionsError) {
    throw new Error('Impossible de vérifier les permissions.');
  }

  const permissions = (rolePermissions || [])
    .map((item) => {
      const permission = Array.isArray(item.permissions)
        ? item.permissions[0]
        : item.permissions;

      return permission?.actif ? permission.code : null;
    })
    .filter(Boolean);

  return {
    profile,
    role,
    permissions: [...new Set(permissions)],
  };
}

/**
 * Vérifie si une permission est présente dans une liste.
 */
export function hasPermission(permissions, requiredPermission) {
  if (!Array.isArray(permissions) || typeof requiredPermission !== 'string') {
    return false;
  }

  return permissions.includes(requiredPermission);
}

/**
 * Vérifie si toutes les permissions demandées sont présentes.
 */
export function hasAllPermissions(permissions, requiredPermissions) {
  if (!Array.isArray(requiredPermissions)) {
    return false;
  }

  return requiredPermissions.every((permission) =>
    hasPermission(permissions, permission)
  );
}

/**
 * Vérifie si au moins une des permissions demandées est présente.
 */
export function hasAnyPermission(permissions, requiredPermissions) {
  if (!Array.isArray(requiredPermissions)) {
    return false;
  }

  return requiredPermissions.some((permission) =>
    hasPermission(permissions, permission)
  );
}
