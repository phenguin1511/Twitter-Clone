enum UserVerifyStatus {
  Unverified,
  Verified,
  Banned
}

enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}


enum MediaType {
  Image,
  Video
}

export { UserVerifyStatus, TokenType, MediaType };
