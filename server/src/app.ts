import express, { Router, Request, Response } from 'express';
import proxy from 'express-http-proxy';

import {StudentsRouter} from './apps/students/view';
import {TeachersRouter} from './apps/teachers/view';
import {AssignmentsRouter} from './apps/assignments/view';
import {SessionsRouter} from './apps/session/view';

const react_url = 'http://localhost:5173';

const PORT = 3000;
const app = express();
const api = Router();

const jsonErrorHandler = (err: any, req: Request, res: Response, next: any) => {
	if (err) {
		res.status(400).send({message: 'bad request'});
	} else {
		next();
	}
};

api.use(express.json());
api.use(jsonErrorHandler);
api.use('/api/sessions', SessionsRouter);
api.use('/api/teachers', TeachersRouter);
api.use('/api/students', StudentsRouter);
api.use('/api/assignments', AssignmentsRouter);

app.use(api);
app.use('', proxy(react_url));

app.listen(PORT, () => {
	console.log('server is running on port', PORT);
});
