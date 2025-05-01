import express, { Router, Request, Response } from 'express';
import crypto from 'crypto';

import {SessionModel, SessionManager} from './model';
import {TeacherModel, TeacherManager} from '../teachers/model';


import config from '../../core/config';

const randomString = (n: number) => {
	const alphabet = "abcdefghijklmnopqrstuvwyxz123456789!@#$%^&*()_+=";
	const chars = [];
	for (let i = 0;i < n;++i) {
		chars.push( alphabet[ Math.floor(Math.random() * alphabet.length) ] );
	}

	return chars.join();
};

const generateSessionId = () => {
	return crypto.createHash('sha1').update(randomString(50)).digest('hex');
};

const invalidateStaleSession = async (session: SessionModel) => {
	try {
		const _session = await new SessionManager().getById(session.id);

		const current_time = Math.floor(new Date().getTime() / 1000);
		const session_time = Math.floor(new Date(_session.created as string).getTime() / 1000);

		if (current_time - session_time > config.SESSION_MAX_TIME) {
			await _session.delete();
			return null;
		} else {
			return _session;
		}
	} catch (e) {
		return null;
	}
};

export const authenticate = async (req: Request, res: Response, next: any) => {
	try {
		const session_id = req.query.session_id;
		if (session_id === undefined) throw Error("no session id set");

		const session = await new SessionManager().getById(session_id);

		invalidateStaleSession(session);

		const is_auth = session.get('is_auth') === "true";
		if (is_auth) {
			next();
		} else {
			const response = {message: 'unauthorized request'};
			res.status(400).send(response);
		}
	} catch (e: any) {
		const response = {message: e.message};
		res.status(400).send(response);
	}
};

const app = Router();


app.post('/auth', async (req: Request, res: Response) => {
	const params = req.body as any;
	let fields;
	try {
		fields = {
			fullname: params.fullname,
			gov_id: params.gov_id
		};
	} catch (e: any) {
		const response = {message: 'bad request'};
		res.status(400).send(response);
		return;
	}

	try {
		const teacher = await new TeacherManager().get(fields);
		let session;
		try {
			session = await new SessionManager().getById(teacher.session_id);
			const is_valid = invalidateStaleSession(session);

			if (!is_valid) throw Error("session not found");

		} catch (e) {
			session = null;
		}

		if (session === null) {
			const id = generateSessionId();
			session = new SessionModel(id);
			session.add("is_auth", "true");
			await session.create();
		}
		
		await teacher.setSessionId(session.id);
		const response = {message: "successful authentication", "id": teacher.id, "session_id": session.id};
		res.send(response);
	} catch (e: any) {
		const response = {message: "invalid credentials"};
		res.status(401).send(response);
	}
});


app.use(authenticate);

app.get('/', async (req: Request, res: Response) => {
	const all = await new SessionManager().all();
	const sessions =  all.map((session: SessionModel) => {
		return {id: session.id, items: session.items};
	});
	res.send(sessions);
});

app.get('/:id', async (req: Request, res: Response) => {
	const model = new SessionManager();
	try {
		const session = await model.getById(req.params.id);
		const is_valid = invalidateStaleSession(session);

		if (!is_valid) throw Error("session not found");

		const response = {id: session.id, items: session.items};
		res.send(response);
	} catch (e) {
		res.status(404).send({'message': 'session not found'});
	}
});

app.post('/', async (req: Request, res: Response) => {
	const params = req.body as any;

	const id = generateSessionId();
	const session = new SessionModel(id);

	if (!params.items) {
		res.status(400).send({message: "bad request"});
	}

	params.items.forEach((item: any) => {
		session.add(item.key, item.value);
	});

	try {
		await session.create();
		const response = {
			message: "created successfully", 
			session_id: session.id,
		};
		res.send(response);
	} catch (e) {
		res.send(e);
		return;
		const response = {
			message: "an error occured",
		};
		res.status(500).send(response);
	}
});

app.put('/:id', async (req: Request, res: Response) => {
	const id = req.params.id;
	const params = req.body as any;

	try {
		const session = await new SessionManager().getById(id);
		const is_valid = invalidateStaleSession(session);

		if (!is_valid) throw Error("session not found");

		for (let k in params.items) {
			const item = params.items[k];
			session.add(item.key, item.value);
		}

		await session.update();
		const response = {message: 'edited successfully'};
		res.send(response);
	} catch (e: any) {
		res.status(404).send("session not found");
	}
});

app.delete('/:id', async (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		const session = await new SessionManager().getById(id);
		const is_valid = invalidateStaleSession(session);

		if (!is_valid) throw Error("session not found");

		await session.delete();

		const response = {message: 'deleted successfully'};
		res.send(response);
	} catch (e) {
		res.status(404).send('session not found');
	}
});



export {app as SessionsRouter};

