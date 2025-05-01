import mysql from 'mysql2/promise';

import { Manager, Model } from '../../core/BaseModel';

export interface TeacherT {
	id?: number;
	session_id?: string;
	gov_id: string;
	fullname: string;
}

const validators = {
	name: (v: string) => {
		return v.match(/[0-9a-zA-Zא-ת]{2,40}/);
	},

	gov_id: (v: string) => {
		return v.match(/[0-9]{9}/);
	},
};

export class TeacherManager extends Manager {
	async getById(id: number): Promise<TeacherModel> {
		return new Promise(async (resolve, reject) => {
			await this.getConnection();

			const query = "SELECT * FROM Teacher WHERE id = ?";
			const [result, meta] = await this.db_conn!.execute(query, [id]);

			if ((result as any[]).length === 0) {
				reject("no teacher found");
				return;
			}

			const teacher = new TeacherModel((result as any[])[0]);
			teacher.id = (result as any)[0].id;
			teacher.session_id = (result as any)[0].session_id;

			await this.closeConnection();
			resolve(teacher);
		});
	}

	async all(): Promise<TeacherModel[]> {
		await this.getConnection();

		return new Promise(async (resolve, reject) => {
			const query = "SELECT * from Teacher";
			const [result] = await this.db_conn!.execute<any[]>(query);

			const teachers = result.map((t: any) => {
				const teacher = new TeacherModel(t)
				teacher.id = t.id;
				teacher.session_id = t.session_id;
				return teacher;
			});
			await this.closeConnection();
			resolve(teachers);
		});
	}

	async get(fields: TeacherT): Promise<TeacherModel> {
		return new Promise(async (resolve, reject) => {
			await this.getConnection();

			const to_update: any[] = [];
			const params: any[] = [];

			Object.keys(fields).forEach((k: string) => {
				to_update.push(`${k} = ?`)
				params.push((fields as any)[k]);
			});

			let query = "SELECT * FROM Teacher WHERE " + to_update.join(" AND ");
			try {
				let [result, meta] = await this.db_conn!.execute(query, params);
				if ((result as any).length === 0) {
					reject({message: "teacher not found"});
				}
				else {
					const r = (result as any)[0];
					const teacher = new TeacherModel({
						fullname: r.fullname,
						gov_id: r.gov_id,
					});
					teacher.id = r.id;
					teacher.session_id = r.session_id;
					resolve(teacher);
				}
			} catch (e: any) {
				reject(e);
			}

			this.closeConnection();
		});
	}
}

export class TeacherModel extends Model {
	manager = new TeacherManager();
	fields: TeacherT;
	id: number|null = null;
	session_id: string|null = null;

	constructor(teacher: TeacherT) {
		super();
		this.fields = teacher;
	}

	get fullname(): string {
		return this.fields.fullname;
	}

	get gov_id(): string {
		return this.fields.gov_id;
	}

	async create() {
		await this.getConnection();

		return new Promise(async (resolve, reject) => {
			if (!this.validFields(this.fields)) {
				reject({message: "invalid values supplied"});
			}

			const query = "INSERT INTO Teacher (fullname, gov_id) VALUES (?, ?)";
			try {
				const [result, meta] = await this.db_conn!.execute(query, [this.fullname, this.gov_id]);
				this.id = (result as unknown as mysql.ResultSetHeader).insertId;
				await this.closeConnection();
				resolve(this);
			} catch (e: any) {
				reject(e);
			}
		});
	}

	async edit(teacher: any) {
		await this.getConnection();

		return new Promise(async (resolve, reject) => {
			const modified = {...this.fields, ...teacher};
			
			if (this.id === null) {
				reject(Error("no id is set for this teacher"));
			}

			if (Object.keys(teacher).length == 0 || !this.validFields(modified)) {
				reject({message: "invalid field values"});
			}

			const query = "UPDATE Teacher SET fullname = ?, gov_id = ? WHERE id = ?";
			try {
				await this.db_conn!.execute(query, [
					modified.fullname,
					modified.gov_id,
					this.id,
				]);
				await this.closeConnection();

				resolve(this);
			} catch (e: any) {
				reject(e);
			}
		});
	}

	async delete() {
		await this.getConnection();

		return new Promise(async (resolve, reject) => {
			if (this.id === null) {
				reject("no teacher id set");
			}

			const query = "DELETE FROM Teacher WHERE id = ?";
			try {
				await this.db_conn!.execute(query, [this.id]);

				await this.closeConnection();
				resolve(null);
			} catch (e: any) {
				reject(e.message);
			}
		});
	}

	async setSessionId(session_id: string) {
		return new Promise(async (resolve, reject) => {
			if (this.id === null) {
				reject("no teacher id set");
			}
			else {
				try {
					const teacher = await new TeacherManager().getById(this.id);
					const query = "UPDATE Teacher SET session_id = ? WHERE id = ?";

					await this.getConnection();
					await this.db_conn!.execute(query, [session_id, this.id]);
					teacher.session_id = session_id;
					resolve(teacher);
				} catch (e) {
					reject(e);
				}

				resolve(this);
				this.closeConnection();
			}
		});
	}

	validFields(teacher: TeacherT) {
		return validators.name(teacher.fullname) && validators.gov_id(teacher.gov_id);
	}

}

