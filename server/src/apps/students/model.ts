import mysql, {Connection} from 'mysql2/promise';

import { Manager, Model } from '../../core/BaseModel';

export interface StudentT {
	first_name: string;
	last_name: string;
	grade: number;
	phone: string;
	teacher_id: number;
}

export class StudentManager extends Manager {
	async getById(id: number): Promise<StudentModel> {
		await this.getConnection();
		
		return new Promise(async (resolve, reject) => {
			const query = "SELECT id, first_name, last_name, grade, phone FROM Student WHERE id = ?";
			const [result, meta] = await this.db_conn!.execute(query, [id]);

			if ((result as any).length == 0) {
				reject(Error("no student found with this id"));
			}
			const student = new StudentModel((result as any[])[0]);
			student.id = (result as any)[0].id;
			await this.closeConnection();
			resolve(student);
		});
	}

	async all(): Promise<StudentModel[]> {
		await this.getConnection();

		return new Promise(async (resolve, reject) => {
			const query = "SELECT * from Student";
			const [result] = await this.db_conn!.execute<any[]>(query);

			const students = result.map((t: any) => {
				const student = new StudentModel(t)
				student.id = t.id;
				return student;
			});
			await this.closeConnection();
			resolve(students);
		});
	}

	async byTeacherId(teacher_id: number): Promise<StudentModel[]> {
		await this.getConnection();

		return new Promise(async (resolve, reject) => {
			const query = "SELECT * from Student WHERE teacher_id = ?";
			const [result] = await this.db_conn!.execute<any[]>(query, [teacher_id]);

			const students = result.map((t: any) => new StudentModel(t));
			await this.closeConnection();
			resolve(students);
		});
	}

}

const validators = {
	name: (v: string) => {
		return v.match(/[0-9a-zA-Zא-ת]{2,20}/);
	},

	grade: (v: number) => {
		return v > 0 && v < 13;
	},

	phone: (v: string) => {
		return v.match(/[0-9]{10}/);
	}
};

export class StudentModel extends Model {
	manager = new StudentManager();
	fields: StudentT;
	id: number|null = null;

	constructor(student: StudentT) {
		super();
		this.fields = student;
	}

	get first_name() {
		return this.fields.first_name;
	}

	get last_name() {
		return this.fields.last_name;
	}

	get grade() {
		return this.fields.grade;
	}

	get phone() {
		return this.fields.phone;
	}

	get teacher_id() {
		return this.fields.teacher_id;
	}

	async create() {
		return new Promise(async (resolve, reject) => {
			await this.getConnection();

			if (!this.validFields(this.fields)) {
				reject(Error("invalid fields"));
				return;
			}

			const query = "INSERT INTO Student (teacher_id, first_name, last_name, grade, phone) VALUES(?, ?, ?, ?, ?)";
			try {
				const [result, meta] = await this.db_conn!.execute(query, [this.teacher_id, this.first_name, this.last_name, this.grade, this.phone]);
				this.id = (result as unknown as mysql.ResultSetHeader).insertId;

				this.closeConnection();
				resolve(this);
			} catch (e: any) {
				reject(e);
			}
		});
	}

	async edit(student: any) {
		await this.getConnection();

		return new Promise(async (resolve, reject) => {
			const modified = {...this.fields, ...student};
			
			if (this.id === null) {
				reject(Error("no id is set for this student"));
			}

			const keys = Object.keys(student);
			const valid = Object.keys(this.fields);
			let is_valid = valid.filter(k => keys.indexOf(k) != -1).length != 0;

			if (keys.length == 0 || !is_valid) {
				reject(Error("incorrect fields supplied"));
			}

			if (!this.validFields(modified)) {
				reject(Error("invalid student fields"));
			}

			const query = "UPDATE Student SET first_name = ?, last_name =  ?, grade = ?, phone = ? WHERE id = ?";
			try {
				await this.db_conn!.execute(query, [
					modified.first_name, 
					modified.last_name,
					modified.grade,
					modified.phone,
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
				reject(Error("no student id set"));
			}

			const query = "DELETE FROM Student WHERE id = ?";
			try {
				await this.db_conn!.execute(query, [this.id]);

				this.closeConnection();
				resolve(null);
			} catch (e: any) {
				reject(e);
			}
		});
	}

	validFields(student: StudentT) {
		const fname = student.first_name;
		const lname = student.last_name;
		const grade = student.grade;
		const phone = student.phone;

		return fname && lname && grade && phone && validators.name(fname) && validators.name(lname) && validators.grade(grade) && validators.phone(phone);
	}
}

