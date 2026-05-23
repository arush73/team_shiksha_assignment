export const DB_NAME = "team_shiksha_assignment"

export const UserRolesEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
  SUPER_ADMIN: "SUPER_ADMIN",
}

export const AvailableUserRoles = Object.values(UserRolesEnum)

export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000

export const UserLoginType = {
  GOOGLE: "GOOGLE",
  GITHUB: "GITHUB",
  EMAIL_PASSWORD: "EMAIL_PASSWORD",
}

export const AvailableSocialLogins = Object.values(UserLoginType)
