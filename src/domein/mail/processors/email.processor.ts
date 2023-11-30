/* eslint-disable prettier/prettier */
import { MailerService } from '@nestjs-modules/mailer';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailProcessorDto } from 'src/application/dtos/users/user.request.dto';

@Processor('emailSending')
export class EmailProcessor {
  constructor(private readonly mailService: MailerService) {}

  @Process('send-otp')
  async sendMail(job: Job<EmailProcessorDto>) {
    const { data } = job;
    const res = await this.mailService.sendMail({
      to: data?.email,
      subject: "Otp code",
      template: 'confirmation',
      context: {
        name: data?.fullName,
        activationCode: data?.otpCode,
      },
    });
    return res;
  }
}
