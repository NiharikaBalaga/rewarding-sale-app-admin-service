import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';


class SNSService {
  private static readonly SNS: SNSClient = new SNSClient({
    apiVersion: 'version',
    region: process.env.aws_region,
    credentials: {
      accessKeyId: process.env.aws_sns_access_key_id || '',
      secretAccessKey: process.env.aws_sns_secret_access_key || '',
    },
  });

  public static async sendAdminLoginDetailsToPhone(phoneNumber: string, oneTimePassword: string){

    const MESSAGE = `Your One Time Password is: ${oneTimePassword} . Please setup you Admin Account  - Sale Spotter App Super Admin`;
    const smsParams = {
      Message: MESSAGE,
      PhoneNumber: `+1${phoneNumber}`,
      MessageAttributes: {
        'AWS.SNS.SMS.SenderID': {
          DataType: 'String',
          StringValue: 'SaleSpotter',
        },
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional',
        },
      },
    };
    try {
      const { MessageId } =  await this.SNS.send(new PublishCommand(smsParams));
      console.log('sendAdminLoginDetailsToPhone Sent Successfully Message-ID', MessageId);
    } catch (sendAdminLoginDetailsToPhoneError) {
      console.error('sendAdminLoginDetailsToPhoneError', sendAdminLoginDetailsToPhoneError);
      throw new Error('sendAdminLoginDetailsToPhoneError');
    }
  }
}

export  {
  SNSService
};