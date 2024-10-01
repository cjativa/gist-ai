import dotenv from 'dotenv';

dotenv.config();

enum EnvironmentStages {
  LOCAL = 'LOCAL',
  DEVELOPMENT = 'DEVELOPMENT',
  PRODUCTION = 'PRODUCTION',
}

export const EnvironmentConfig = {
  /** Port used only for local development */
  port: process.env.PORT,

  /** Environment indicating stage for the application */
  nodeEnv: process.env.NODE_ENV!!.toUpperCase() as EnvironmentStages,

  /** Configuration regarding the user sessions */
  session: {
    secret: process.env.SESSION_SECRET,
  },
};

/** Helper function to check is current stage is Production */
export const isProduction =
  EnvironmentConfig.nodeEnv === EnvironmentStages.PRODUCTION;

/** Helper function to check is current stage is Local */
export const isLocal = EnvironmentConfig.nodeEnv === EnvironmentStages.LOCAL;

/** Helper function to check is current stage is Development */
export const isDevelopment =
  EnvironmentConfig.nodeEnv === EnvironmentStages.DEVELOPMENT;
