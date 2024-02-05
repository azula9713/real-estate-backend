import confg from 'config';
import jwt from 'jsonwebtoken';

const privateKey = confg.get<string>('jwtPrivateKey');
// const publicKey = confg.get<string>('jwtPublicKey');

const signJWT = (object: Record<string, unknown>, options?: jwt.SignOptions | undefined) => {
  return jwt.sign(object, privateKey, {
    ...options,
  });
};

const verifyJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, privateKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (err) {
    return {
      valid: false,
      expired: (err as Error).message === 'jwt expired',
      decoded: null,
    };
  }
};

export { signJWT, verifyJWT };
