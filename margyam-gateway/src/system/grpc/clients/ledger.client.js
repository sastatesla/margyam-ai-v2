import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../../../common/index.js';
import appConfig from '../../../configs/app.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load proto from local common folder ────────────────────────────────────
const PROTO_PATH = path.resolve(__dirname, '../../../common/proto/ledger.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const ledgerProto = grpc.loadPackageDefinition(packageDef).margyam.ledger;

// ── gRPC Client (singleton) ────────────────────────────────────────────────
const client = new ledgerProto.LedgerService(
  appConfig.grpc.ledgerAddress,
  grpc.credentials.createInsecure()
);

const promisify = (method, payload) =>
  new Promise((resolve, reject) => {
    client[method](payload, (err, response) => {
      if (err) {
        logger.error(`[gRPC] Ledger.${method} failed`, { error: err.message });
        return reject(err);
      }
      resolve(response);
    });
  });

/**
 * verifyAndDeduct — Atomically checks balance and deducts coins.
 * @param {{ userId, amount, idempotency_key, description }} payload
 */
export const verifyAndDeduct = (payload) => promisify('VerifyAndDeduct', payload);

/**
 * refundCoins — Credits coins back after an AI worker failure.
 * @param {{ transaction_id, reason }} payload
 */
export const refundCoins = (payload) => promisify('RefundCoins', payload);

/**
 * getBalance — Returns current wallet balance (read-only).
 * @param {{ userId }} payload
 */
export const getBalance = (payload) => promisify('GetBalance', payload);
