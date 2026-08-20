import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../../../common/index.js';
import appConfig from '../../../configs/app.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load proto from local common folder ────────────────────────────────────
const PROTO_PATH = path.resolve(__dirname, '../../../common/proto/astro.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const astroProto = grpc.loadPackageDefinition(packageDef).margyam.astro;

// ── gRPC Client (singleton) ────────────────────────────────────────────────
const client = new astroProto.AstroService(
  appConfig.grpc.astroAddress,
  grpc.credentials.createInsecure()
);

/**
 * calculateChart — Calls margyam-ai to compute natal chart.
 * @param {{ userId, latitude, longitude, date_of_birth, time_of_birth, timezone }} payload
 * @returns {Promise<ChartResponse>}
 */
export const calculateChart = (payload) => {
  return new Promise((resolve, reject) => {
    client.CalculateChart(payload, (err, response) => {
      if (err) {
        logger.error('[gRPC] CalculateChart failed', { error: err.message });
        return reject(err);
      }
      resolve(response);
    });
  });
};

/**
 * runRagQuery — Calls margyam-ai to run a RAG query.
 * @param {{ userId, sessionId, query, language }} payload
 * @returns {Promise<RagResponse>}
 */
export const runRagQuery = (payload) => {
  return new Promise((resolve, reject) => {
    client.RunRagQuery(payload, (err, response) => {
      if (err) {
        logger.error('[gRPC] RunRagQuery failed', { error: err.message });
        return reject(err);
      }
      resolve(response);
    });
  });
};
