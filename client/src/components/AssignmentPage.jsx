import { useState, useEffect } from 'react';

import {List} from './List.jsx';
import {api} from '../api.js';
import {useAuth} from '../hooks/useAuth.jsx';
 
export const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [assignmentsList, setAssignmentsList] = useState([]);
  const {user} = useAuth();

  const fields = [
    {name: "id", isMeta: true},
    {name: 'title', isMeta: false},
    {name: 'content', isMeta: false},
  ];

  useEffect(() => {
    (async () => {
      const list = await api.assignments.list();
      const displayList = list.map(assignment => {
        const {teacher_id, ...rest} = assignment;
        return rest;
      });
      setAssignmentsList(displayList);
      setAssignments(list);
    })();
  }, []);

  const onAdd = async (fields) => {
    const teacher_id = user.id;
    const response = await api.assignments.create({...fields, teacher_id});

    const errors = [];

    if (!response.createdAssignment) {
      errors.push("Couldn't create assignment. Something went wrong");
    }

    setAssignmentsList([
      ...assignmentsList, 
      {
        id: response.createdAssignment.id,
        title: fields.title,
        content: fields.content,
      }
    ]);

    return errors;
  };

  const onDelete = async (selected) => {
    const deletedIds = selected.reduce((deleted, s, i) => {
      return s ? [...deleted, assignmentsList[i].id]:deleted;
    }, []);

    await deletedIds.forEach(async (id) => {
      await api.assignments.delete(id);
    });

    setAssignmentsList(selected.reduce((list, s, i) => !s ? [...list, assignmentsList[i]]:list, []));

    return new Promise((resolve) => resolve(null));
  };

  const onEdit = (row, field, value) => {
    return new Promise(async (resolve, reject) => {
      const id = assignmentsList[row].id;
      const fields = {[field]: value};
      const response = await api.assignments.edit(id, fields);

      const errors = [];
      
      if (response.message != 'successfully edited') {
        errors.push('something went wrong');
      }
      else {
        const new_assignments = assignments.map((assignment, i) => {
          return row == i ? {...assignment, [field]: value}:assignment;
        });
        setAssignmentsList(new_assignments);

      }
      return errors;
    });
  };

  return (
    <div className="page-assignments">
      <h2> Assignment Page </h2>
      <List
        fields={fields}
        rows={assignmentsList}
        
        onAdd={onAdd}
        onDelete={onDelete}
        onEdit={onEdit} />
    </div>
  );
};


