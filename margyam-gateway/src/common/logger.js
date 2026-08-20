import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors } = format;
const LOG_LEVEL = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

const devFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, service, stack, ...meta }) => {
    const svc = service ? `[${service}] ` : '';
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} ${level}: ${svc}${message}${stack ? `\n${stack}` : ''}${metaStr}`;
  })
);

const prodFormat = combine(timestamp(), errors({ stack: true }), format.json());

export const logger = createLogger({
  level: LOG_LEVEL,
  defaultMeta: { service: process.env.SERVICE_NAME || 'margyam-gateway' },
  format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  transports: [new transports.Console()],
  exitOnError: false,
});
