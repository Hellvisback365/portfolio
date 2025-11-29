import { ChatOpenAI } from '@langchain/openai';
import { getRagEnv } from './env';

let cachedModel: ChatOpenAI | null = null;

export function getChatModel() {
  if (!cachedModel) {
    const { openRouterApiKey, llmModel, openRouterBaseUrl, openRouterSite, openRouterTitle } = getRagEnv();
    cachedModel = new ChatOpenAI({
      apiKey: openRouterApiKey,
      modelName: llmModel,
      temperature: 0.2,
      configuration: {
        baseURL: openRouterBaseUrl,
        defaultHeaders: {
          'HTTP-Referer': openRouterSite,
          'X-Title': openRouterTitle,
        },
      },
    });
  }
  return cachedModel;
}
