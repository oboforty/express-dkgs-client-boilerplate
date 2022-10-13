
namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: string | undefined;
        PORT: string | undefined;

        DOORS_IDENTITY_URI: string | undefined;
        JWKS_REPLICATE_INTERVAL: string | undefined;
        JWKS_CACHE_FILE: string | undefined;
    }
}
