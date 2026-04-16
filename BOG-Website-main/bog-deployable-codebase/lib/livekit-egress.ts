import { EncodedFileOutput, EgressClient } from 'livekit-server-sdk';

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }

  return value;
}

export function getEgressClient() {
  const wsUrl = getRequiredEnv('NEXT_PUBLIC_LIVEKIT_URL');
  const host = wsUrl.replace(/^wss:\/\//, 'https://');

  return new EgressClient(
    host,
    getRequiredEnv('LIVEKIT_API_KEY'),
    getRequiredEnv('LIVEKIT_API_SECRET')
  );
}

export function getS3Config() {
  return {
    accessKey: getRequiredEnv('RECORDINGS_S3_ACCESS_KEY'),
    secret: getRequiredEnv('RECORDINGS_S3_SECRET_KEY'),
    bucket: getRequiredEnv('RECORDINGS_S3_BUCKET'),
    region: getRequiredEnv('RECORDINGS_S3_REGION'),
    endpoint: getRequiredEnv('RECORDINGS_S3_ENDPOINT'),
    forcePathStyle:
      getRequiredEnv('RECORDINGS_S3_FORCE_PATH_STYLE') === 'true',
  };
}

export function createRecordingFilepath(roomName: string) {
  const safeRoomName = roomName.replace(/[^a-zA-Z0-9-_]/g, '-');
  return `recordings/${safeRoomName}-${Date.now()}.mp4`;
}

export function createPublicRecordingUrl(filepath: string) {
  const supabaseUrl = getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL');
  const bucket = getRequiredEnv('RECORDINGS_S3_BUCKET');

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filepath}`;
}

export function createFileOutput(
  roomName: string,
  filepath?: string
): EncodedFileOutput {
  const finalFilepath = filepath ?? createRecordingFilepath(roomName);

  return {
    filepath: finalFilepath,
    output: {
      case: 's3',
      value: getS3Config(),
    },
  } as any;
}