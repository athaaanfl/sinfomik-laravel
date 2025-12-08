export enum UserRole {
    ADMIN = 'admin',
    GURU = 'guru',
}

export const UserRoleLabel: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.GURU]: 'Guru',
};
