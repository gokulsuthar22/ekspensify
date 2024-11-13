import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from 'src/shared/otp/otp.service';
import { UserRepository } from 'src/shared/user/user.repository';
import { SignIn, SignUp } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private otpService: OtpService,
    private jwtService: JwtService,
  ) {}

  async signIn(data: SignIn) {
    // Find the user by email
    let user = await this.userRepo.findOne({ email: data.email });
    // If user is not found, throw an error suggesting to sign up
    if (!user) {
      throw new HttpException(
        'No account found with this email. Please sign up first.',
        HttpStatus.NOT_FOUND,
      );
    }
    // Verify the OTP for the provided email
    const isValidOtp = await this.otpService.verify(data.email, +data.otp);
    // If the OTP is invalid, throw an error indicating it is incorrect or expired
    if (!isValidOtp) {
      throw new HttpException(
        'Incorrect OTP or has been expired',
        HttpStatus.UNAUTHORIZED,
      );
    }
    // Check if the user's account status is inactive, and throw an error if it is
    if (user.status === 'INACTIVE') {
      throw new HttpException(
        'Your account is currently inactive. Please contact support to reactivate it.',
        HttpStatus.FORBIDDEN,
      );
    }
    user = await this.userRepo.findByIdAndUpdate(user.id, { isVerified: true });
    // Generate a JWT token for the authenticated user
    const token = await this.jwtService.signAsync({ sub: user.id });
    // Return the generated token along with the user details
    return { token, user };
  }

  async signUp(data: SignUp) {
    // Create a new user with the extracted email and name
    const user = await this.userRepo.create({
      email: data.email,
      name: data.name,
    });
    // Send email otp
    // await this.otpService.send(user.email, user.name);
    await this.otpService.send(user.email);
    // Return the token and user details
    return user;
  }
}
