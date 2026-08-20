import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../../common/index.js';
import appConfig from '../../configs/app.config.js';
import walletHandler from './handlers/wallet.handler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROTO_PATH = path.resolve(__dirname, '../../common/proto/ledger.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true, longs: String, enums: String, defaults: true, oneofs: true,
});

const ledgerProto = grpc.loadPackageDefinition(packageDef).margyam.ledger;

let server;

export const startGrpcServer = async () => {
  server = new grpc.Server();
  server.addService(ledgerProto.LedgerService.service, walletHandler);
  server.bindAsync(
    `0.0.0.0:${appConfig.grpc.port}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) { logger.error('[gRPC] Bind failed', { error: err.message }); return; }
      logger.info(`🔌 gRPC server listening on port ${port}`);
      server.start();
    }
  );
};
