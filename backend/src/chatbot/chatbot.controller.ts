import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}
  @Get('/')
  getHello(): string {
    return 'Hello World';
  }

  @Post('/talk')
  async talkToChatbot(
    @Req() req: Request,
    @Body('prompt') prompt: string,
    @Body('sessionId') sessionId: string,
    @Res() res: Response,
  ) {
    // console.log('Request Method:', req.method);
    // console.log('Request Headers:', req.headers);
    if (!prompt || !sessionId) {
      return res
        .status(400)
        .send({ error: 'Prompt and Session ID are required.' });
    }

    try {
      const response = await this.chatbotService.progressConversation(
        sessionId,
        prompt,
      );
      return res.status(200).send({ response });
    } catch (error) {
      console.error('Error in talkToChatbot:', error);
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  }
  @Post('/suggest')
  async suggestQuestions(
    @Body('context') context: string,
    @Res() res: Response,
  ) {
    if (!context) {
      return res.status(400).send({ error: 'Context is required.' });
    }

    try {
      const suggestedQuestions =
        await this.chatbotService.generateSuggestedQuestions(context);
      return res.status(200).send({ suggestedQuestions });
    } catch (error) {
      console.error('Error in suggestQuestions:', error);
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  }
}

// @Get('/loadPdfData')
// @HttpCode(HttpStatus.OK)
// async loadPdfData() {
//   try {
//     await this.chatbotService.loadAndSplitPdfFiles();
//     return { message: 'PDF data loaded successfully.' };
//   } catch (error) {
//     console.error('Error loading PDF data:', error);
//     throw error; // or return a custom error message
//   }
// }
