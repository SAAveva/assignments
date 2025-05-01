import mysql, {Connection} from 'mysql2/promise';
import config from './config';
import { logger } from './logging';
import i18n from './i18n.config';
const __ = i18n.__;

export class Model {
	db_conn: Connection|null = null;
	fields: any;

	async createConnection() {
		try { 
			this.db_conn = await mysql.createConnection(config.db);
			await this.db_conn.connect();
		} catch (err) {
			logger.error(err);
			throw err;
		}
	}

	async getConnection() {
		if (!this.db_conn) {
			await this.createConnection();
		}
	}

	async closeConnection() {
		if (this.db_conn !== null) {
			await this.db_conn!.end();
			this.db_conn = null;
		}
	}

	create() {}
	edit(fields: any) {}
	delete() {}

}

export class Manager extends Model {
	getById(user_id: number) {}
	all() {}
}
