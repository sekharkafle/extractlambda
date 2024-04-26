import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import * as dotenv from 'dotenv';
import sendAIRequest from './client/aiclient';
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';


const formatExtractMessage = (message) => {
  const txt = message.text;
    const fields = message.fields.join(', ');
    return `Human:You are an expert assistant with expertise in extracting key values. From the given text, extract ${fields}. If an extracted value is currency, return it as a whole number.\n<TEXT>${txt}</TEXT>\n\nAssistant:`;
};

export const handler = async (event)=> {
  dotenv.config();
  if (event) {
    const bedrock = new BedrockRuntimeClient({
      serviceId: 'bedrock',
      region: 'us-east-1',
    });
    let prompt = "";
    if(event.extractMessage){
      prompt = formatExtractMessage(event.extractMessage);
    const resText = await sendAIRequest(prompt);
    let aiRes = JSON.parse(resText)
    return aiRes.completion
  }
  return {
    statusCode: 400,
    body: `{'error':'Invalid input params.'}`,
  };
};

