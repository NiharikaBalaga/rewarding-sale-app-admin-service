import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import type { PublishCommandInput } from '@aws-sdk/client-sns';
import type { IUser } from '../DB/Models/User';
import type { IPostPointsSchema } from '../DB/Models/Post-points.schema';
import { Events } from './events.enum';


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

  private static async _publishToRewardTopicARN(Message: string) { // groupId should be POST ID of reward
    try {
      const messageParams: PublishCommandInput = {
        Message,
        TopicArn: process.env.REWARD_TOPIC_SNS_ARN,
      };
      console.log('SNSService messageParams: ', messageParams);
      const { MessageId } = await this.SNS.send(
        new PublishCommand(messageParams),
      );
      console.log('SNSService MessageId: ', MessageId);
      console.log('_publishToRewardTopicARN-success', MessageId);
    } catch (_publishToRewardTopicARNError) {
      console.error(
        '_publishToRewardTopicARNError',
        _publishToRewardTopicARNError,
      );
    }
  }

  static async updateUserRewards(user: IUser) {
    console.log('SNSService user: ', user);
    console.log('SNSService user.id: ', user.id);
    // console.log('SNSService reward.id: ', postPoints.postId);
    const EVENT_TYPE = Events.rewardUserUpdatePoints;
    const snsMessage = Object.assign({ user }, { EVENT_TYPE, userId: user.id });
    console.log(`Publishing ${EVENT_TYPE} to Reward Topic`);
    return this._publishToRewardTopicARN(JSON.stringify(snsMessage));
  }

  static async updatePostPointsRewards(postPoints: IPostPointsSchema) {
    console.log('SNSService postPoints: ', postPoints);
    // console.log('SNSService reward.id: ', postPoints.postId);
    const EVENT_TYPE = Events.rewardPostPointsUpdatePoints;
    const snsMessage = Object.assign({ postPoints }, { EVENT_TYPE });
    console.log(`Publishing ${EVENT_TYPE} to Reward Topic`);
    return this._publishToRewardTopicARN(JSON.stringify(snsMessage));
  }
}

export  {
  SNSService
};