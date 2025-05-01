import express, { Router, Request, Response } from 'express';

import {StudentModel, StudentManager} from './model';
import {authenticate} from '../session/view';

const app = Router();

app.use(express.json());
app.use(authenticate);

app.get('/', async (req: Request, res: Response) => {
	const all = await new StudentManager().all();
	const students =  all.map((student: StudentModel) => {
		return {...student.fields, id: student.id};
	});
	res.send(students);
});

app.get('/:id', async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	if (isNaN(id)) {
		res.status(400).send({message: "invalid student id"});
		return;
	}

	const model = new StudentManager();
	try {
		const student = await model.getById(id);
		const response = {...student.fields, id: student.id};

		res.send(response);
	} catch (e: any) {
		const response = {message: e.message};
		res.status(404).send(response);
	}
});

app.post('/', async (req: Request, res: Response) => {
	const student = new StudentModel(req.body as any);
	try {
		await student.create();
		const response = {
			message: "created successfully", 
			"createdStudent": {id: student.id, ...student.fields}
		};
		res.send(response);
	} catch (e: any) {
		const response = {message: e.message};
		res.status(400).send(response);
	}
});

app.put('/:id', async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.id);
		if (isNaN(id)) throw Error("invalid student id");

		const student = await new StudentManager().getById(id);
		await student.edit(req.body);
		const response = {message: 'edited successfully'};
		res.send(response);
	}
	catch (e: any) {
		const response = {messsage: e.message};
		res.status(400).send(response);
	}
});

app.delete('/:id', async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.id);
		if (isNaN(id)) throw(Error("invalid student"));

		const student = await new StudentManager().getById(id);
		await student.delete();
		const response = {message: 'deleted successfully'};
		res.send(response);
	} catch (e: any) {
		const response = {message: e.message};
		res.status(404).send(response);
	}
});

export {app as StudentsRouter};

