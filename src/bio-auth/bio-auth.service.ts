import * as crypto from 'crypto';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { BioAuthRepository } from './bio-auth.repository';
import { UserDto } from './dtos/create-user.dto';
import { IUser } from './interfaces/user.interface';
import { EnableBioAuthDto } from './dtos/enable-bio-auth.dto';
import { DisableBioAuthDto } from './dtos/disable-bio-auth.dto';
import { IDevice } from './interfaces/device.interface';
import { IHashToken } from './interfaces/hash-token.interface';
import { BioLoginDto } from './dtos/bio-login.dto';

@Injectable()
export class BioAuthService {
  private readonly salt: string = crypto.randomBytes(16).toString('hex');
  private readonly keylen = 64;

  constructor(private readonly bioAuthRepository: BioAuthRepository) {}

  signup({ email, password }: UserDto): IUser {
    const existingUser: IUser = this.bioAuthRepository.getUserByEmail(email);

    if (existingUser) throw new BadRequestException('Email is taken');

    const user: IUser = {
      userId: crypto.randomUUID(),
      email,
      password: this.hashString(password),
      bioAuth: false,
    };

    return this.bioAuthRepository.addUser(user);
  }

  login({ email, password }: UserDto): IUser {
    const user: IUser = this.bioAuthRepository.getUserByEmail(email);

    if (!user || user.password !== this.hashString(password))
      throw new UnauthorizedException();

    return user;
  }

  bioLogin({ deviceId, signature }: BioLoginDto): IUser {
    const device: IDevice = this.bioAuthRepository.getDeviceById(deviceId);

    if (!device) throw new UnauthorizedException();

    const user: IUser = this.bioAuthRepository.getUserById(device.userId);

    if (!user || !user.bioAuth) throw new UnauthorizedException();

    const isValidSignature: boolean = this.verifySignature(
      device.hashToken,
      device.publicKey,
      signature,
    );

    console.log({ isValidSignature });

    if (!isValidSignature) throw new UnauthorizedException();

    return user;
  }

  private verifySignature(
    hashToken: string,
    publicKey: string,
    signature: string,
  ): boolean {
    const fullKey: string = this.restorePublicKey(publicKey);

    console.log({ fullKey });
    console.log({ signature });

    // // const verifier = crypto.createVerify('sha256');
    // // verifier.update(hashToken, 'utf8');

    // const publicKeyBuf = Buffer.from(fullKey, 'utf8');
    const signatureBuf = Buffer.from(signature, 'base64');

    // // return verifier.verify(fullKey, signature);

    // // const isVerified = crypto.verify(
    // //     'sha256',
    // //     Buffer.from(verifiableData),
    // //     {
    // //       key: publicKey,
    // //       padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    // //     },
    // //     signature,
    // //   );

    // return crypto.verify(
    //   'sha256',
    //   Buffer.from(hashToken),
    //   {
    //     key: Buffer.from(fullKey, 'utf8'),
    //     padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    //   },
    //   signatureBuf,
    // );

    return crypto.verify(
      'sha256',
      Buffer.from(hashToken),
      {
        key: fullKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      },
      signatureBuf,
    );
  }

  private restorePublicKey(publicKey: string): string {
    const keyBegin = '-----BEGIN RSA PUBLIC KEY-----\n';
    const keyEnd = '\n-----END RSA PUBLIC KEY-----';
    const fullKey = keyBegin + publicKey + keyEnd;

    return fullKey;
  }

  enableBioAuth(enableBioAuthDto: EnableBioAuthDto): void {
    const { userId, deviceId, publicKey } = enableBioAuthDto;

    const user: IUser = this.bioAuthRepository.getUserById(userId);

    if (!user) throw new UnauthorizedException();

    const hashToken: string = crypto.randomUUID().replace(/-/g, '');

    this.bioAuthRepository.addDevice({
      userId,
      deviceId,
      publicKey,
      hashToken: 'this need to be verified',
    });

    this.bioAuthRepository.setBioAuth(userId, true);
  }

  disableBioAuth({ userId }: DisableBioAuthDto): void {
    const user: IUser = this.bioAuthRepository.getUserById(userId);

    if (!user) throw new UnauthorizedException();

    this.bioAuthRepository.setBioAuth(userId, false);
  }

  getHashToken(deviceId: string): IHashToken {
    const device: IDevice = this.bioAuthRepository.getDeviceById(deviceId);

    if (!device) {
      throw new UnauthorizedException();
    }

    const { hashToken } = device;

    return { hashToken };
  }

  private hashString(str: string): string {
    try {
      return crypto.scryptSync(str, this.salt, this.keylen).toString('hex');
    } catch (error) {
      throw new BadRequestException('Error occurred, try again later');
    }
  }
}
