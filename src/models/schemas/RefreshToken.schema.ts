import { ObjectId } from "mongodb";

interface RefreshTokenType {
      _id?: ObjectId
      user_id: ObjectId
      token: string
      createdAt?: Date

}

export default class RefreshToken {
      _id?: ObjectId
      token: string
      user_id: ObjectId
      createdAt: Date

      constructor(refreshToken: RefreshTokenType) {
            this._id = refreshToken._id
            this.token = refreshToken.token
            this.user_id = refreshToken.user_id
            this.createdAt = refreshToken.createdAt || new Date()
      }
}