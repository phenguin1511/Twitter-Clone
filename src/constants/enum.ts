enum UserVerifyStatus {
  Unverified,
  Verified,
  Banned
}

enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerificationToken
}

export { UserVerifyStatus, TokenType };
