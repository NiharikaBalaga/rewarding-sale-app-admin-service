import { Events } from './events.enum';
import { UserService } from './User';

class SQSProcessorService {
  static async ProcessSqsMessage(messages: any[]) {

    try {
      await Promise.all(
        messages.map(({ Body }) => {
          try {
            const parsedBody = JSON.parse(Body);
            if (parsedBody.Message) {
              // Message sent by SNS
              const parsedMessage = JSON.parse(parsedBody.Message);
              if (parsedMessage['EVENT_TYPE'])
                return this._handleMessageEventsSentBySNS(parsedMessage);
            } else {
              // Message sent by Queue itself
            }
          } catch (error) {
            console.error('Error processing SQS message:', error);
            throw error;
          }
        }),
      );
    } catch (error) {
      console.error('Error processing SQS messages:', error);
      throw error;
    }
  }


  private static async _handleMessageEventsSentBySNS(parsedMessage: any) {
    const { EVENT_TYPE, user, userId, token, updatedUser } =
      parsedMessage;
    console.log(EVENT_TYPE, user, userId, token, updatedUser);
    switch (EVENT_TYPE) {
      case Events.userCreatedByPhone:
        return this._handleUserCreationByPhone(user, userId);
      case Events.tokenBlackList:
        return this._handleTokenBlackListEvent(token);
      case Events.userUpdate:
        return this._handleUserUpdatedEvent(updatedUser, userId);
      default:
        console.warn(`Unhandled event type: ${EVENT_TYPE}`);
        break;
    }
  }
  private static async _handleUserCreationByPhone(user: any, userId: string) {
    try {
      await UserService.createUserByPhone(user, userId);
    } catch (error) {
      console.error('_handleUserCreationByPhone-error', error);
      throw error;
    }
  }

  private static async _handleTokenBlackListEvent(token: string) {
    try {
      await UserService.addTokenInBlackList(token);
    } catch (error){
      console.error('_handleTokenBlackListEvent_error', error);
      throw error;
    }
  }

  private static async _handleUserUpdatedEvent(user: any, userId: string) {
    try {
      await UserService.updateUser(userId, user);
    } catch (error){
      console.error('_handleUserUpdatedEvent', error);
      throw error;
    }
  }
}

export {
  SQSProcessorService
};