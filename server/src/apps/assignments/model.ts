import mysql, {Connection} from 'mysql2/promise';

import { Manager, Model } from '../../core/BaseModel';

export interface AssignmentT {
	teacher_id: number;
	title: string;
	content: string;
}

export class AssignmentManager extends Manager {
	async getById(id: number): Promise<AssignmentModel> {
		await this.getConnection();
		
		return new Promise(async (resolve, reject) => {
			const query = "SELECT id, teacher_id, title, content FROM Assignment WHERE id = ?";
			const [result, meta] = await this.db_conn!.execute(query, [id]);

			if ((result as any).length == 0) {
				reject(Error("no assignment found with this id"));
			}
			const assignment = new AssignmentModel((result as any[])[0]);
			assignment.id = (result as any)[0].id;
			await this.closeConnection();
			resolve(assignment);
		});
	}

	async all(): Promise<AssignmentModel[]> {
		await this.getConnection();

		return new Promise(async (resolve, reject) => {
			const query = "SELECT * from Assignment";
			const [result] = await this.db_conn!.execute<any[]>(query);

			const assignments = result.map((t: any) => {
				const assignment = new AssignmentModel(t)
				assignment.id = t.id;
				return assignment;
			});
			await this.closeConnection();
			resolve(assignments);
		});
	}

	async byTeacherId(teacher_id: number): Promise<AssignmentModel[]> {
		await this.getConnection();

		return new Promise(async (resolve, reject) => {
			const query = "SELECT * from Assignment WHERE teacher_id = ?";
			const [result] = await this.db_conn!.execute<any[]>(query, [teacher_id]);

			const assignments = result.map((t: any) => new AssignmentModel(t));
			await this.closeConnection();
			resolve(assignments);
		});
	}

}

export class AssignmentModel extends Model {
	manager = new AssignmentManager();
	fields: AssignmentT;
	id: number|null = null;

	constructor(assignment: AssignmentT) {
		super();
		this.fields = assignment;
	}

	get teacher_id() {
		return this.fields.teacher_id;
	}

	get title() {
		return this.fields.title;
	}

	get content() {
		return this.fields.content;
	}

	async create() {
		await this.getConnection();
		return new Promise(async (resolve, reject) => {
			if (!this.validFields(this.fields)) {
				reject(Error("invalid fields"));
				return;
			}

			const query = "INSERT INTO Assignment (teacher_id, title, content) VALUES(?, ?, ?)";
			try {
				const [result, meta] = await this.db_conn!.execute(query, [this.teacher_id, this.title, this.content]);
				this.id = (result as unknown as mysql.ResultSetHeader).insertId;

				this.closeConnection();
				resolve(this);
			} catch (e: any) {
				reject(Error("couldn't create new assignment"));
			}
		});
	}

	async edit(assignment: any) {
		await this.getConnection();

		return new Promise(async (resolve, reject) => {
			const modified = {...this.fields, ...assignment};
			
			if (this.id === null) {
				reject(Error("no id is set for this assignment"));
			}

			const keys = Object.keys(assignment);
			const valid = Object.keys(this.fields);
			let is_valid = valid.filter(k => keys.indexOf(k) != -1).length != 0;

			if (keys.length == 0 || !is_valid) {
				reject(Error("incorrect fields supplied"));
			}

			if (!this.validFields(modified)) {
				reject(Error("invalid assignment fields"));
			}

			const query = "UPDATE Assignment SET title = ?, content = ? WHERE id = ?";
			try {
				await this.db_conn!.execute(query, [
					modified.title,
					modified.content,
					this.id,
				]);
				this.closeConnection();

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
				reject(Error("no assignment id set"));
			}

			const query = "DELETE FROM Assignment WHERE id = ?";
			try {
				await this.db_conn!.execute(query, [this.id]);

				this.closeConnection();
				resolve(null);
			} catch (e: any) {
				reject(e);
			}
		});
	}

	validFields(assignment: AssignmentT) {
		const title = assignment.title;
		const content = assignment.content;
		const teacher_id = assignment.teacher_id;

		return title && content && teacher_id && title.length < 255 && content.length < 255 && !isNaN(Number(teacher_id));
	}
}


