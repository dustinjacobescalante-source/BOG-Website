import { AccessToken } from 'livekit-server-sdk';

type CreateParticipantTokenParams = {
  roomName: string;
  participantName: string;
  participantIdentity: string;
  canPublish?: boolean;
  canSubscribe?: boolean;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getLiveKitConfig() {
  return {
    apiKey: getRequiredEnv('LIVEKIT_API_KEY'),
    apiSecret: getRequiredEnv('LIVEKIT_API_SECRET'),
    wsUrl: getRequiredEnv('NEXT_PUBLIC_LIVEKIT_URL'),
  };
}

export async function createLiveKitParticipantToken({
  roomName,
  participantName,
  participantIdentity,
  canPublish = true,
  canSubscribe = true,
}: CreateParticipantTokenParams) {
  const { apiKey, apiSecret } = getLiveKitConfig();

  const token = new AccessToken(apiKey, apiSecret, {
    identity: participantIdentity,
    name: participantName,
    ttl: '2h',
  });

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish,
    canSubscribe,
    canPublishData: true,
  });

  return await token.toJwt();
}
