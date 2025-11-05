import { randomUUID } from 'crypto';
import { DynamoDBClient, PutItemCommand, GetItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { Lti13Event } from './eventToRequest';

/**
 * Generates a UUID for state and nonce and stores them in DynamoDB with TTL.
 */
export const generateAndStore = async (dynamoDbClient: DynamoDBClient): Promise<{ state: string; nonce: string }> => {
  const state = randomUUID();
  const nonce = randomUUID();
  const ttl = Math.floor(Date.now() / 1000) + 300; // TTL of 5 minutes

  // Store state and nonce in DynamoDB
  const params = {
    TableName: process.env.STATE_TABLE_NAME,
    Item: {
      state: { S: state },
      nonce: { S: nonce },
      ttl: { N: ttl.toString() },
    },
  };

  await dynamoDbClient.send(new PutItemCommand(params));

  return { state, nonce };
};

export type Validate = (dynamoDbClient: DynamoDBClient, request: Lti13Event) => Promise<boolean>;

/**
 * Check the values and immediatly delete them from the table in the same transaction
 */
export const validate = async (dynamoDbClient: DynamoDBClient, request: Lti13Event): Promise<boolean> => {
  const getParams = {
    TableName: process.env.STATE_TABLE_NAME,
    Key: {
      state: { S: request.state },
    },
    ProjectionExpression: 'nonce',
    ConsistentRead: true, //Ensure we're not accessing something already deleted, but not yet propogated
  };

  const getResult = await dynamoDbClient.send(new GetItemCommand(getParams));
  const retrievedNonce = getResult.Item?.nonce?.S;

  if (!retrievedNonce || retrievedNonce !== request.nonce) {
    throw new Error(`Invalid or mismatched nonce, expected ${request.nonce}, got ${retrievedNonce}`);
  }

  // Delete the state after validation so it can't be used again
  const deleteParams = {
    TableName: process.env.STATE_TABLE_NAME,
    Key: {
      state: { S: request.state },
    },
  };

  await dynamoDbClient.send(new DeleteItemCommand(deleteParams));

  return true;
};
