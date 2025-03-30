import { ObjectId } from 'mongodb';


interface FollowerType {
      _id?: ObjectId;
      user_id: ObjectId;
      user_id_to_follow: ObjectId;
      createdAt?: Date;
}

export default class Follower {
      _id?: ObjectId;
      user_id: ObjectId;
      user_id_to_follow: ObjectId;
      createdAt?: Date;

      constructor({ _id, user_id, user_id_to_follow, createdAt }: FollowerType) {
            this._id = _id;
            this.user_id = user_id;
            this.user_id_to_follow = user_id_to_follow;
            this.createdAt = createdAt;
      }
}



