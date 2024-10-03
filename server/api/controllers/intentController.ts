import express from 'express';

import { IntentService } from '../services';

export class IntentController {
  public static async handleSummarize(
    request: express.Request,
    response: express.Response
  ) {
    const { content } = request.body;
    const intentResult = await IntentService.performSummarization(content);

    return response.status(200).json(`Generic response`);
  }

  public static async handleExplain(
    request: express.Request,
    response: express.Response
  ) {
    const { content } = request.body;
    const intentResult = await IntentService.performExplanation(content);

    return response.status(200).json(`Generic response`);
  }

  public static async handleRephrase(
    request: express.Request,
    response: express.Response
  ) {
    return response.status(200).json(`Generic response`);
  }

  public static async handleActionPlan(
    request: express.Request,
    response: express.Response
  ) {
    return response.status(200).json(`Generic response`);
  }

  public static async retrieveStories(
    request: express.Request,
    response: express.Response
  ) {
    const artworkId = request.params.artworkId;

    return response.status(200).json({ data: [] });
  }

  public static async markStoryAsRead(
    request: express.Request,
    response: express.Response
  ) {
    const artworkId = request.params.artworkId;
    const storyId = request.params.storyId;

    // Look up the bookmark for this artwork for the user
    /*  const bookmarks = await prisma.bookmarks.findMany({
      where: {
        image_id: artworkId,
        session_id: sessionId,
      },
    });

    if (bookmarks.length > 0 && request.session.blob.hasOwnProperty(storyId)) {
      request.session.blob[storyId].read = true;
      await prisma.bookmarks.updateMany({
        where: {
          image_id: artworkId,
          session_id: sessionId,
        },
        data: { story_read: true },
      });

      return response.status(200).json({
        data: {
          success: true,
        },
        message: 'Story has been marked as read successfully!',
      });
    }

    // Otherwise, somehow there's no bookmark entry for any artworks related to this story
    else {
      return response.status(404).json({
        data: {
          success: false,
        },
        message: 'Entry not found!',
      });
    } */
  }
}
