export interface LoginPayload {
  username: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
}

export interface RegisterPayload {
  username: string;
  password?: string;
  fullName: string;
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  LOCKED = "LOCKED",
  DELETED = "DELETED",
}

export const UserStatusText: Record<string, string> = {
  ACTIVE: "Hoạt động",
  LOCKED: "Khóa",
  DELETED: "Đã xóa",
};

export interface UserDto {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar: string;
  phoneNumber: string;
  dob?: string;
  roles?: { name: string }[] | string[];
  status?: UserStatus | string | number;
}

export interface UpdateMyInfoPayload {
  fullName: string;
  email?: string;
  phoneNumber?: string;
  dob?: string;
}

export interface ChangePasswordPayload {
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}
export interface SearchUserPayload {
  keyword?: string;
  status?: string;
  page?: number;
  size?: number;
}

export interface CreateUserPayload {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  password?: string;
}
