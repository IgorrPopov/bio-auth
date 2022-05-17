import { IDevice } from './interfaces/device.interface';
import { IUser } from './interfaces/user.interface';

export class BioAuthRepository {
  private users: IUser[] = [];
  private devices: IDevice[] = [];

  addUser(user: IUser): IUser {
    this.users.push(user);
    return user;
  }

  getUserById(userId: string): IUser {
    return this.users.find((user: IUser) => user.userId === userId);
  }

  getUserByEmail(email: string): IUser {
    return this.users.find((user: IUser) => user.email === email);
  }

  addDevice(device: IDevice): IDevice {
    this.devices.push(device);
    return device;
  }

  getDeviceById(deviceId: string): IDevice {
    return this.devices.find((device: IDevice) => device.deviceId === deviceId);
  }

  setBioAuth(userId: string, bioAuth: boolean): IUser {
    const user: IUser = this.users.find(
      (user: IUser) => user.userId === userId,
    );

    if (user) {
      user.bioAuth = bioAuth;

      return user;
    }
  }
}
