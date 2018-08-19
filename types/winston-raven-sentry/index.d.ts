import * as Transport from 'winston-transport';
import { config } from 'winston';
import { Client, ConstructorOptions } from 'raven';

declare interface WinstonRavenSentry extends Transport {
	new (options: WinstonRavenSentry.Options): WinstonRavenSentry;
}

declare namespace WinstonRavenSentry {
	export interface Options {
		dsn?: string;
		config?: ConstructorOptions;
		install?: boolean;
		errorHandler?: false | ((error: Error) => void);
		raven?: Client;

		name?: string;
		silent?: boolean;
		level?: string;
		levelsMap?: config.AbstractConfigSetLevels;
	}
}

export = WinstonRavenSentry;
