import express, { Router, Request, Response } from 'express';

import {AssignmentModel, AssignmentManager} from './model';
import {authenticate} from '../session/view';

const app = Router();

app.use(express.json());
app.use(authenticate);

app.get('/', async (req: Request, res: Response) => {
	const all = await new AssignmentManager().all();
	const assignments =  all.map((assignment: AssignmentModel) => {
		return {...assignment.fields, id: assignment.id};
	});
	res.send(assignments);
});

app.get('/:id', async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	if (isNaN(id)) {
		res.status(400).send({message: "invalid assignment id"});
		return;
	}

	const model = new AssignmentManager();
	try {
		const assignment = await model.getById(id);
		const response = {...assignment.fields, id: assignment.id};

		res.send(response);
	} catch (e: any) {
		const response = {message: e.message};
		res.status(404).send(response);
	}
});

app.post('/', async (req: Request, res: Response) => {
	try {
		const assignment = new AssignmentModel(req.body as any);
		await assignment.create();
		const response = {
			message: "created successfully", 
			"createdAssignment": {id: assignment.id, ...assignment.fields}
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
		if (isNaN(id)) throw Error("invalid assignment id");

		const assignment = await new AssignmentManager().getById(id);
		await assignment.edit(req.body);
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
		if (isNaN(id)) throw(Error("invalid assignment"));

		const assignment = await new AssignmentManager().getById(id);
		await assignment.delete();
		const response = {message: 'deleted successfully'};
		res.send(response);
	} catch (e: any) {
		const response = {message: e.message};
		res.status(404).send(response);
	}
});

export {app as AssignmentsRouter};

