namespace NodeJS {
    interface ProcessEnv {
        //Application
        PORT: number;
        NODE_ENV: string;
        //Database
        DB_PORT: number;
        DB_NAME: string;
        DB_USERNAME: string;
        DB_PASSWORD: string;
        DB_HOST: string;
        //jwt tokens
        ACCESS_TOKEN_SECRET: string;
        REFRESH_TOKEN_SECRET: string;
        //cookie
        COOKIE_SECRET: string;
    }
}