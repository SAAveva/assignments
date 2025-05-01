import mysql from 'mysql2/promise';

import { Manager, Model } from '../../core/BaseModel';

interface SessionT {
	id?: string;
	key: string;
	value: string;
};

export class SessionManager extends Manager {
	async getById(id: any): Promise<SessionModel> {
		return new Promise(async (resolve, reject) => {
			await this.getConnection();
			const query = "SELECT * FROM Session WHERE id = ?";
			const [result, meta] = await this.db_conn!.execute(query, [id]);

			if ((result as any[]).length == 0) {
				reject({message: "no session with this id found"});
				this.closeConnection();
				return;
			}

			const session = new SessionModel(id);
			(result as any[]).forEach(session_item => {
				session.add(session_item.key, session_item.value);
			});
			session.created = (result as any)[0].created;
			await this.closeConnection();

			resolve(session);
		});
	}

	async all(): Promise<SessionModel[]> {
		return new Promise(async (resolve, reject) => {
			await this.getConnection();

			const query = "SELECT * FROM Session";
			const [results, meta] = await this.db_conn!.execute(query);

			const _sessions: any = {};
			await (results as any).forEach((s: any) => {
				if (_sessions[s.id] === undefined) {
					_sessions[s.id] = new SessionModel(s.id);
					_sessions[s.id].created = s.created;
				}
				_sessions[s.id].add(s.key, s.value);
			});

			resolve(Object.values(_sessions));

			this.closeConnection();
		});
	}
}

export class SessionModel extends Model {
	manager = new SessionManager();
	items: SessionT[];
	id: string;
	created: string|null = null;

	constructor(id: string) {
		super();
		this.id = id;
		this.items = [];
	}

	async create() {
		return new Promise(async (resolve, reject) => {
			await this.getConnection();

			let exists = false;
			try {
				await new SessionManager().getById(this.id);
				reject("session already exists");
				exists = true;
			} catch (e: any) {}

			if (!exists) {
				const _session = new SessionModel(this.id);

				this.items.forEach(async (item) => {
					_session.add(item.key, item.value)
				});

				let query = "INSERT INTO Session (id, `key`, value) VALUES (?, ?,?)";
				const params = [this.id, this.items[0].key, this.items[0].value];
				
				for (let i = 1;i < this.items.length;++i) {
					query += ",(?, ?, ?)";
					params.push(this.id, this.items[i].key, this.items[i].value);
				}

				try {
					const [result, meta] = await this.db_conn!.execute(query, params);
					resolve(this);
				} catch (e: any) {
					reject(e.message);
				}
			}

			this.closeConnection();
		});
	}

	async update() {
		return new Promise(async (resolve, reject) => {
			await this.getConnection();

			let session: any;
			try {
				session = await new SessionManager().getById(this.id);
			} catch (e: any) {
				reject("session doesn't exist");
				this.closeConnection();
				return;
			}

			const to_update: any = [];
			const new_items: any  = [];

			this.items.forEach((item) => {
				const exists = session.items.filter((i: any) => i.key == item.key);
				if (exists.length !== 0) {
					to_update.push(item);
				} else {
					new_items.push(item);
				}
			});


			if (to_update.length !== 0) {
				let update_query = "UPDATE Session SET value = ? WHERE id = ? and `key` = ?";
				try {
					await this.db_conn!.beginTransaction();

					await to_update.forEach(async (item: any) => {
						await this.db_conn!.execute(update_query, [item.value, this.id, item.key]);
					});

					await this.db_conn!.commit();
				} catch (e: any) {
					reject(e.message);
				}
			}

			if (new_items.length !== 0) {
				try {
					let insert_query = "INSERT INTO Session (id, `key`, value) VALUES ";
					const params: any = [];

					new_items.forEach((item: any) => {
						params.push(this.id, item.key, item.value);
					});
					insert_query += Array(Math.floor(params.length/3)).fill(null).map(() => "(?, ?, ?)").join(",");

					await this.db_conn!.execute(insert_query, params);
				} catch (e: any) {
					reject(e.message);
				} finally {
					this.closeConnection();
				}
			}

			resolve(this);
			await this.closeConnection();
		});
	}

	async delete() {
		return new Promise(async (resolve, reject) => {
			await this.getConnection();

			if (this.id === null) {
				reject("no session id set");
			}
			else {
				const delete_teacher_session_query = "UPDATE Teacher SET session_id = null WHERE session_id = ?";
				const delete_session_query = "DELETE FROM Session WHERE id = ?";

				try {
					this.db_conn!.beginTransaction();
					await this.db_conn!.execute(delete_teacher_session_query, [this.id]);
					await this.db_conn!.execute(delete_session_query, [this.id]);
					await this.db_conn!.commit();
					resolve(null);
				} catch (e: any) {
					reject(e);
				}
			}
			await this.closeConnection();
		});
	}

	add(key: string, value: string) {
		this.items.push({key, value});
	}

	get(key: string) {
		for (let i = 0;i < this.items.length;++i) {
			if (this.items[i].key == key) {
				return this.items[i].value;
			}
		}
		return null;
	}
}
