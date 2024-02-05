import bcrypt from 'bcrypt';
import config from 'config';
import mongoose from 'mongoose';
import { IListing } from './listing.model';

export interface UserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: number;
  phoneNum: string;
  profilePic: string;
  savedListings: IListing['_id'][];
  location: string;
}

export interface IUser extends UserInput, mongoose.Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minlength: 3, maxlength: 50 },
    lastName: { type: String, required: true, minlength: 3, maxlength: 50 },
    email: { type: String, required: true, minlength: 5, maxlength: 255, unique: true },
    password: { type: String, required: true, minlength: 8, maxlength: 1024 },
    userType: { type: Number, required: true, default: 0 }, //0:buyer, 1:seller 2:broker 3:admin
    phoneNum: { type: String, required: true, minlength: 10 },
    location: { type: String, required: true },
    savedListings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
    profilePic: { type: String, required: true },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  const user = this as IUser;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));
  const hash = await bcrypt.hash(user.password, salt);

  // Replace the password with the hash
  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  const user = this as IUser;

  return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
