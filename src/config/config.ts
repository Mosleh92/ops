/**
 * MallOS Enterprise - Configuration
 * Central configuration management for the enterprise platform
 */

import { cleanEnv, str, num, bool, makeValidator } from '@/utils/envalid';

// Custom validator for comma-separated lists
const csv = makeValidator((input: string) => input.split(','));

// Validate environment variables
export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'staging', 'production', 'test'] }),
  PORT: num({ default: 3001 }),
  API_VERSION: str({ default: 'v1' }),
  APP_NAME: str(),
  APP_DESCRIPTION: str(),
  APP_VERSION: str(),

  CORS_ORIGIN: csv({ default: 'http://localhost:3000' }),
  INTEGRATION_CORS_ORIGINS: csv({ default: 'http://localhost:3000' }),

  DB_HOST: str(),
  DB_PORT: num(),
  DB_NAME: str(),
  DB_USER: str(),
  DB_PASSWORD: str(),
  DB_SSL: bool({ default: false }),
  DB_POOL_MIN: num({ default: 5 }),
  DB_POOL_MAX: num({ default: 20 }),

  MONGO_URI: str(),
  MONGO_DB_NAME: str(),

  REDIS_HOST: str(),
  REDIS_PORT: num(),
  REDIS_PASSWORD: str({ default: '' }),
  REDIS_DB: num({ default: 0 }),

  ELASTICSEARCH_NODE: str(),
  ELASTICSEARCH_INDEX: str(),

  JWT_SECRET: str(),
  JWT_EXPIRES_IN: str({ default: '24h' }),
  JWT_REFRESH_EXPIRES_IN: str({ default: '7d' }),
  BCRYPT_ROUNDS: num({ default: 12 }),
  SESSION_SECRET: str(),
  SESSION_COOKIE_SECURE: bool({ default: false }),
  SESSION_COOKIE_HTTPONLY: bool({ default: true }),
  SESSION_COOKIE_MAX_AGE: num({ default: 86400000 }),

  RATE_LIMIT_WINDOW_MS: num({ default: 900000 }),
  RATE_LIMIT_MAX_REQUESTS: num({ default: 100 }),

  SENDGRID_API_KEY: str({ default: '' }),
  SENDGRID_FROM_EMAIL: str(),
  SENDGRID_FROM_NAME: str(),

  TWILIO_ACCOUNT_SID: str({ default: '' }),
  TWILIO_AUTH_TOKEN: str({ default: '' }),
  TWILIO_PHONE_NUMBER: str({ default: '' }),

  STRIPE_SECRET_KEY: str({ default: '' }),
  STRIPE_PUBLISHABLE_KEY: str({ default: '' }),
  STRIPE_WEBHOOK_SECRET: str({ default: '' }),

  AWS_ACCESS_KEY_ID: str({ default: '' }),
  AWS_SECRET_ACCESS_KEY: str({ default: '' }),
  AWS_REGION: str({ default: 'us-east-1' }),
  AWS_S3_BUCKET: str({ default: 'mallos-enterprise-files' }),
  AWS_S3_BUCKET_REGION: str({ default: 'us-east-1' }),

  ETHEREUM_NETWORK: str({ default: 'mainnet' }),
  ETHEREUM_RPC_URL: str({ default: '' }),
  ETHEREUM_PRIVATE_KEY: str({ default: '' }),
  SMART_CONTRACT_ADDRESS: str({ default: '' }),

  OPENAI_API_KEY: str({ default: '' }),
  OPENAI_MODEL: str({ default: 'gpt-4' }),

  AZURE_COMPUTER_VISION_KEY: str({ default: '' }),
  AZURE_COMPUTER_VISION_ENDPOINT: str({ default: '' }),

  TENSORFLOW_SERVING_URL: str({ default: 'http://localhost:8501' }),

  AZURE_IOT_HUB_CONNECTION_STRING: str({ default: '' }),
  AZURE_IOT_HUB_HOSTNAME: str({ default: '' }),

  MQTT_BROKER_URL: str(),
  MQTT_USERNAME: str(),
  MQTT_PASSWORD: str(),

  SENTRY_DSN: str({ default: '' }),
  SENTRY_ENVIRONMENT: str({ default: 'development' }),
  NEW_RELIC_LICENSE_KEY: str({ default: '' }),
  NEW_RELIC_APP_NAME: str({ default: 'MallOS Enterprise' }),
  PROMETHEUS_PORT: num({ default: 9090 }),

  SAP_CLIENT_ID: str({ default: '' }),
  SAP_CLIENT_SECRET: str({ default: '' }),
  SAP_BASE_URL: str({ default: '' }),

  SALESFORCE_CLIENT_ID: str({ default: '' }),
  SALESFORCE_CLIENT_SECRET: str({ default: '' }),
  SALESFORCE_LOGIN_URL: str({ default: 'https://login.salesforce.com' }),

  DOCUSIGN_ACCOUNT_ID: str({ default: '' }),
  DOCUSIGN_INTEGRATION_KEY: str({ default: '' }),
  DOCUSIGN_USER_ID: str({ default: '' }),
  DOCUSIGN_PRIVATE_KEY_PATH: str({ default: './certs/docusign-private-key.pem' }),

  RABBITMQ_URL: str(),
  RABBITMQ_USERNAME: str(),
  RABBITMQ_PASSWORD: str(),

  KAFKA_BROKERS: str({ default: 'localhost:9092' }),
  KAFKA_CLIENT_ID: str({ default: 'mallos-enterprise' }),
  KAFKA_GROUP_ID: str({ default: 'mallos-consumer-group' }),

  WEBSOCKET_PORT: num({ default: 3002 }),
  SOCKET_IO_CORS_ORIGIN: str({ default: 'http://localhost:3000' }),

  DEFAULT_TENANT_ID: str({ default: 'default' }),
  TENANT_HEADER_NAME: str({ default: 'X-Tenant-ID' }),
  TENANT_SUBDOMAIN_ENABLED: bool({ default: true }),

  DEFAULT_LOCALE: str({ default: 'en' }),
  SUPPORTED_LOCALES: csv({ default: 'en,ar' }),
  RTL_LOCALES: csv({ default: 'ar' }),

  ENABLE_AI_ANALYTICS: bool({ default: true }),
  ENABLE_IOT_INTEGRATION: bool({ default: true }),
  ENABLE_BLOCKCHAIN: bool({ default: true }),
  ENABLE_COMPUTER_VISION: bool({ default: true }),
  ENABLE_PREDICTIVE_MAINTENANCE: bool({ default: true }),
  ENABLE_FACIAL_RECOGNITION: bool({ default: true }),
  ENABLE_VOICE_ASSISTANT: bool({ default: true }),
  ENABLE_AR_VR: bool({ default: true }),

  LOG_LEVEL: str({ default: 'debug' }),
  ENABLE_SWAGGER: bool({ default: true }),
  ENABLE_GRAPHQL_PLAYGROUND: bool({ default: true }),
  ENABLE_METRICS: bool({ default: true }),
  ENABLE_HEALTH_CHECK: bool({ default: true }),

  TEST_DB_NAME: str({ default: 'mallos_enterprise_test' }),
  TEST_MONGO_URI: str({ default: 'mongodb://localhost:27017/mallos_enterprise_test' }),
});

export interface Config {
  // Application
  app: {
    name: string;
    description: string;
    version: string;
    environment: string;
    port: number;
    apiVersion: string;
    corsOrigin?: string;
  };

  // Database
  database: {
    host: string;
    port: number;
    name: string;
    username: string;
    password: string;
    ssl: boolean;
    pool: {
      min: number;
      max: number;
    };
  };

  // Redis
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };

  // MongoDB
  mongodb: {
    uri: string;
    database: string;
  };

  // Elasticsearch
  elasticsearch: {
    node: string;
    index: string;
  };

  // Authentication
  auth: {
    jwtSecret: string;
    jwtExpiresIn: string;
    jwtRefreshExpiresIn: string;
    bcryptRounds: number;
    sessionSecret: string;
    sessionCookieSecure: boolean;
    sessionCookieHttpOnly: boolean;
    sessionCookieMaxAge: number;
  };

  // Rate Limiting
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };

  // CORS
  cors: {
    origin: string | string[];
    credentials: boolean;
  };

  // External Services
  services: {
    sendgrid: {
      apiKey: string;
      fromEmail: string;
      fromName: string;
    };
    twilio: {
      accountSid: string;
      authToken: string;
      phoneNumber: string;
    };
    stripe: {
      secretKey: string;
      publishableKey: string;
      webhookSecret: string;
    };
    aws: {
      accessKeyId: string;
      secretAccessKey: string;
      region: string;
      s3Bucket: string;
      s3BucketRegion: string;
    };
  };

  // Blockchain
  blockchain: {
    ethereum: {
      network: string;
      rpcUrl: string;
      privateKey: string;
      smartContractAddress: string;
    };
  };

  // AI & ML
  ai: {
    openai: {
      apiKey: string;
      model: string;
    };
    azure: {
      computerVisionKey: string;
      computerVisionEndpoint: string;
    };
    tensorflow: {
      servingUrl: string;
    };
  };

  // IoT
  iot: {
    azure: {
      iotHubConnectionString: string;
      iotHubHostname: string;
    };
    mqtt: {
      brokerUrl: string;
      username: string;
      password: string;
    };
  };

  // Monitoring
  monitoring: {
    sentry: {
      dsn: string;
      environment: string;
    };
    newRelic: {
      licenseKey: string;
      appName: string;
    };
    prometheus: {
      port: number;
    };
  };

  // Third-party Integrations
  integrations: {
    sap: {
      clientId: string;
      clientSecret: string;
      baseUrl: string;
    };
    salesforce: {
      clientId: string;
      clientSecret: string;
      loginUrl: string;
    };
    docusign: {
      accountId: string;
      integrationKey: string;
      userId: string;
      privateKeyPath: string;
    };
  };

  // Message Queue
  messageQueue: {
    rabbitmq: {
      url: string;
      username: string;
      password: string;
    };
    kafka: {
      brokers: string;
      clientId: string;
      groupId: string;
    };
  };

  // WebSocket
  websocket: {
    port: number;
    corsOrigin: string;
  };

  // Multi-tenancy
  multiTenancy: {
    defaultTenantId: string;
    tenantHeaderName: string;
    subdomainEnabled: boolean;
  };

  // Localization
  localization: {
    defaultLocale: string;
    supportedLocales: string[];
    rtlLocales: string[];
  };

  // Feature Flags
  features: {
    enableAI: boolean;
    enableIoT: boolean;
    enableBlockchain: boolean;
    enableComputerVision: boolean;
    enablePredictiveMaintenance: boolean;
    enableFacialRecognition: boolean;
    enableVoiceAssistant: boolean;
    enableARVR: boolean;
  };

  // Development
  development: {
    logLevel: string;
    enableSwagger: boolean;
    enableGraphQLPlayground: boolean;
    enableMetrics: boolean;
    enableHealthCheck: boolean;
  };
}

export const config: Config = {
  app: {
    name: process.env.APP_NAME || 'MallOS Enterprise',
    description: process.env.APP_DESCRIPTION || 'Enterprise Mall Management Platform',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3001', 10),
    apiVersion: process.env.API_VERSION || 'v1',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'mallos_enterprise',
    username: process.env.DB_USER || 'mallos_user',
    password: process.env.DB_PASSWORD || 'mallos_password',
    ssl: process.env.DB_SSL === 'true',
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '5', 10),
      max: parseInt(process.env.DB_POOL_MAX || '20', 10),
    },
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },

  mongodb: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/mallos_enterprise',
    database: process.env.MONGO_DB_NAME || 'mallos_enterprise',
  },

  elasticsearch: {
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
    index: process.env.ELASTICSEARCH_INDEX || 'mallos_enterprise',
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-key',
    sessionCookieSecure: process.env.SESSION_COOKIE_SECURE === 'true',
    sessionCookieHttpOnly: process.env.SESSION_COOKIE_HTTPONLY !== 'false',
    sessionCookieMaxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE || '86400000', 10),
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
    credentials: true,
  },

  services: {
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY || '',
      fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@mallos.com',
      fromName: process.env.SENDGRID_FROM_NAME || 'MallOS Enterprise',
    },
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    },
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      region: process.env.AWS_REGION || 'us-east-1',
      s3Bucket: process.env.AWS_S3_BUCKET || 'mallos-enterprise-files',
      s3BucketRegion: process.env.AWS_S3_BUCKET_REGION || 'us-east-1',
    },
  },

  blockchain: {
    ethereum: {
      network: process.env.ETHEREUM_NETWORK || 'mainnet',
      rpcUrl: process.env.ETHEREUM_RPC_URL || '',
      privateKey: process.env.ETHEREUM_PRIVATE_KEY || '',
      smartContractAddress: process.env.SMART_CONTRACT_ADDRESS || '',
    },
  },

  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: process.env.OPENAI_MODEL || 'gpt-4',
    },
    azure: {
      computerVisionKey: process.env.AZURE_COMPUTER_VISION_KEY || '',
      computerVisionEndpoint: process.env.AZURE_COMPUTER_VISION_ENDPOINT || '',
    },
    tensorflow: {
      servingUrl: process.env.TENSORFLOW_SERVING_URL || 'http://localhost:8501',
    },
  },

  iot: {
    azure: {
      iotHubConnectionString: process.env.AZURE_IOT_HUB_CONNECTION_STRING || '',
      iotHubHostname: process.env.AZURE_IOT_HUB_HOSTNAME || '',
    },
    mqtt: {
      brokerUrl: env.MQTT_BROKER_URL,
      username: env.MQTT_USERNAME,
      password: env.MQTT_PASSWORD,
    },
  },

  monitoring: {
    sentry: {
      dsn: process.env.SENTRY_DSN || '',
      environment: process.env.SENTRY_ENVIRONMENT || 'development',
    },
    newRelic: {
      licenseKey: process.env.NEW_RELIC_LICENSE_KEY || '',
      appName: process.env.NEW_RELIC_APP_NAME || 'MallOS Enterprise',
    },
    prometheus: {
      port: parseInt(process.env.PROMETHEUS_PORT || '9090', 10),
    },
  },

  integrations: {
    sap: {
      clientId: process.env.SAP_CLIENT_ID || '',
      clientSecret: process.env.SAP_CLIENT_SECRET || '',
      baseUrl: process.env.SAP_BASE_URL || '',
    },
    salesforce: {
      clientId: process.env.SALESFORCE_CLIENT_ID || '',
      clientSecret: process.env.SALESFORCE_CLIENT_SECRET || '',
      loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com',
    },
    docusign: {
      accountId: process.env.DOCUSIGN_ACCOUNT_ID || '',
      integrationKey: process.env.DOCUSIGN_INTEGRATION_KEY || '',
      userId: process.env.DOCUSIGN_USER_ID || '',
      privateKeyPath: process.env.DOCUSIGN_PRIVATE_KEY_PATH || './certs/docusign-private-key.pem',
    },
  },

  messageQueue: {
    rabbitmq: {
      url: env.RABBITMQ_URL,
      username: env.RABBITMQ_USERNAME,
      password: env.RABBITMQ_PASSWORD,
    },
    kafka: {
      brokers: process.env.KAFKA_BROKERS || 'localhost:9092',
      clientId: process.env.KAFKA_CLIENT_ID || 'mallos-enterprise',
      groupId: process.env.KAFKA_GROUP_ID || 'mallos-consumer-group',
    },
  },

  websocket: {
    port: parseInt(process.env.WEBSOCKET_PORT || '3002', 10),
    corsOrigin: process.env.SOCKET_IO_CORS_ORIGIN || 'http://localhost:3000',
  },

  multiTenancy: {
    defaultTenantId: process.env.DEFAULT_TENANT_ID || 'default',
    tenantHeaderName: process.env.TENANT_HEADER_NAME || 'X-Tenant-ID',
    subdomainEnabled: process.env.TENANT_SUBDOMAIN_ENABLED === 'true',
  },

  localization: {
    defaultLocale: process.env.DEFAULT_LOCALE || 'en',
    supportedLocales: process.env.SUPPORTED_LOCALES ? process.env.SUPPORTED_LOCALES.split(',') : ['en', 'ar'],
    rtlLocales: process.env.RTL_LOCALES ? process.env.RTL_LOCALES.split(',') : ['ar'],
  },

  features: {
    enableAI: process.env.ENABLE_AI_ANALYTICS === 'true',
    enableIoT: process.env.ENABLE_IOT_INTEGRATION === 'true',
    enableBlockchain: process.env.ENABLE_BLOCKCHAIN === 'true',
    enableComputerVision: process.env.ENABLE_COMPUTER_VISION === 'true',
    enablePredictiveMaintenance: process.env.ENABLE_PREDICTIVE_MAINTENANCE === 'true',
    enableFacialRecognition: process.env.ENABLE_FACIAL_RECOGNITION === 'true',
    enableVoiceAssistant: process.env.ENABLE_VOICE_ASSISTANT === 'true',
    enableARVR: process.env.ENABLE_AR_VR === 'true',
  },

  development: {
    logLevel: process.env.LOG_LEVEL || 'debug',
    enableSwagger: process.env.ENABLE_SWAGGER === 'true',
    enableGraphQLPlayground: process.env.ENABLE_GRAPHQL_PLAYGROUND === 'true',
    enableMetrics: process.env.ENABLE_METRICS === 'true',
    enableHealthCheck: process.env.ENABLE_HEALTH_CHECK === 'true',
  },
};

// Export individual config sections for convenience
export const {
  app,
  database,
  redis,
  mongodb,
  elasticsearch,
  auth,
  rateLimit,
  cors,
  services,
  blockchain,
  ai,
  iot,
  monitoring,
  integrations,
  messageQueue,
  websocket,
  multiTenancy,
  localization,
  features,
  development,
} = config; 