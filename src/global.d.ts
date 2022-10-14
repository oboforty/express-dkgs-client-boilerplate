
namespace NodeJS {

    interface ProcessEnv {
        NODE_ENV: string | undefined;

        // App
        PORT: string | undefined;
        FRIENDLY_ERRORS: "yes" | "no" | undefined;

        // JWKS
        DOORS_IDENTITY_URI: string | undefined;
        JWKS_REPLICATE_INTERVAL: string | undefined;
        JWKS_CACHE_FILE: string | undefined;

        // Logging
        LOG_LABEL: string | undefined;
        LOG_LEVEL_CONSOLE: string | undefined;
        LOG_LEVEL_FILE: string | undefined;
        LOG_LEVEL_DB: string | undefined;
        LOG_FILE: string | undefined;

        // DB
    }
}
