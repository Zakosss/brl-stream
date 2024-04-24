declare global {
	namespace NodeJS {
		interface ProcessEnv {
            // DISCORD

			DISCORD_TOKEN: string;
            DISCORD_CLIENT_ID: string;

			// API

            API_KEY: string;
			API_PORT: number;

			// OTHER

			DATABASE_URL: string;
		}
	}
}

export {};
