import express, { Router, Request, Response } from 'express';

import {TeacherModel, TeacherManager} from './model';
import {authenticate} from '../session/view';

const app = Router();

app.use(express.json());
app.use(authenticate);

app.get('/', async (req: Request, res: Response) => {
	const all = await new TeacherManager().all();
	const teachers =  all.map((teacher: TeacherModel) => {
		return {...teacher.fields, id: teacher.id};
	});
	res.send(teachers);
});

app.get('/:id', async (req: Request, res: Response) => {
	const model = new TeacherManager();
	try {
		const teacher = await model.getById(Number(req.params.id));
		const response = {...teacher.fields, id: teacher.id};

		res.send(response);
	} catch (e) {
		res.status(404).send({'message': 'teacher not found'});
	}
});

app.post('/', async (req: Request, res: Response) => {
	const teacher = new TeacherModel(req.body as any);
	try {
		await teacher.create();
		const response = {
			message: "created successfully", 
			"createdTeacher": {...teacher.fields, id: teacher.id}
		};
		res.send(response);
	} catch (e: any) {
		const response = {message: e.message};
		res.status(500).send(response);
	}
});

app.put('/:id', async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.id);
		if (isNaN(id)) throw Error("invalid teacher id");

		const teacher = await new TeacherManager().getById(id);
		await teacher.edit(req.body);
		const response = {message: 'edited successfully'};
		res.send(response);
	}
	catch (e: any) {
		const response = {messsage: e.message};
		res.status(404).send(response);
	}
});

app.delete('/:id', async (req: Request, res: Response) => {
	try {
		const teacher = await new TeacherManager().getById(Number(req.params.id));
		await teacher.delete();
		const response = {message: 'deleted successfully'};
		res.send(response);
	} catch (e) {
		res.status(404).send('teacher not found');
	}
});

export {app as TeachersRouter};

