export interface TestUser {
  username: string;
  password: string;
  expectedError?: string;
}

export interface UserDataFile {
  validUsers: TestUser[];
  invalidUsers: TestUser[];
  problemUsers: TestUser[];
}
