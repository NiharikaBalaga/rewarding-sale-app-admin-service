import { Events } from './events.enum';
import { UserService } from './User';
import type mongoose from 'mongoose';
import { PostDLLService } from './PostDLL';
import type { IPostDLL } from '../DB/Models/Post-DLL';
import { PostService } from './Post';
import type { IPost } from '../DB/Models/Post';
import { VoteService } from './Vote';
import { ReportService } from './Report';
import type { IUser } from '../DB/Models/User';
import type { IVote } from '../DB/Models/Vote';
import { IReport } from '../DB/Models/Report';

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
    const {
      EVENT_TYPE, user, userId, token, updatedUser, post, postId,
      updatedPost, deletedPost, postDLL, postDLLId, updatedPostDLL, deletedPostDLL, reportType, vote, report
    } = parsedMessage;
    console.log(EVENT_TYPE, user, userId, token, updatedUser, post, postId,
      updatedPost, deletedPost, postDLL, postDLLId, updatedPostDLL, deletedPostDLL, reportType, vote, report);
    switch (EVENT_TYPE) {
      case Events.userCreatedByPhone:
        return this._handleUserCreationByPhone(user, userId);
      case Events.tokenBlackList:
        return this._handleTokenBlackListEvent(token);
      case Events.userUpdate:
        return this._handleUserUpdatedEvent(updatedUser, userId);
      case Events.userNewPost:
        return this._handleUserNewPost(post, postId);
      case Events.userPostUpdate:
        return this._handleUserPostUpdate(updatedPost, postId);
      case Events.userPostDelete:
        return this._handleUserPostDelete(postId);
      case Events.postDLLNewNode:
        return this._handlerPostDLLNewNode(postDLL, postDLLId);
      case Events.postDLLUpdate:
        return this._handlePostDLLUpdate(updatedPostDLL, postDLLId);
      case Events.postDLLDelete:
        return this._handlePostDLLDelete(postDLLId);
      case Events.newVote:
        return this._handleVoteCreation(postId, vote);
      case Events.newReport:
        return this._handleReportCreation(postId, report);
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

  private static async _handleVoteCreation(postId: mongoose.Types.ObjectId, vote: IVote) {
    try {
      console.log('postId: ', postId);
      await VoteService.vote(postId, vote);
    } catch (error) {
      console.error('_handleVoteCreation-error', error);
      throw error;
    }
  }

  private static async _handleReportCreation(postId: mongoose.Types.ObjectId, report: IReport) {
    try {
      await ReportService.reportPost(postId, report);
    } catch (error) {
      console.error('_handleVoteCreation-error', error);
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

  private static async _handleUserNewPost(post: IPost, postId: mongoose.Types.ObjectId) {
    try {
      await PostService.createPostWithGivenPostId(post, postId);
    } catch (error) {
      console.error('_handleUserNewPost-error', error);
      throw error;
    }
  }

  private static async _handleUserPostUpdate(updatedPost: IPost, postId: mongoose.Types.ObjectId) {
    try {
      await PostService.updatePost(updatedPost, postId);
    } catch (error) {
      console.error('_handleUserPostUpdate-error', error);
      throw error;
    }
  }

  private static async _handleUserPostDelete(postId: mongoose.Types.ObjectId) {
    try {
      await PostService.deletePost(postId);
    } catch (error) {
      console.error('_handleUserPostDelete-error', error);
      throw error;
    }
  }

  private static async _handlerPostDLLNewNode(PostDLL: IPostDLL, postDLLId: mongoose.Types.ObjectId) {
    try {
      await PostDLLService.newNode(PostDLL, postDLLId);
    } catch (error) {
      console.error('_handlerPostDLLNewNode-error', error);
      throw error;
    }
  }

  private static async _handlePostDLLUpdate(postDLL: IPostDLL, postDLLId: mongoose.Types.ObjectId) {
    try {
      await PostDLLService.updateNode(postDLL, postDLLId);
    } catch (error) {
      console.error('_handlePostDLLUpdate-error', error);
      throw error;
    }
  }

  private static async _handlePostDLLDelete(postDLLId: mongoose.Types.ObjectId) {
    try {
      await PostDLLService.deleteNode(postDLLId);
    } catch (error) {
      console.error('_handlePostDLLDelete-error', error);
      throw error;
    }
  }
}

export {
  SQSProcessorService
};