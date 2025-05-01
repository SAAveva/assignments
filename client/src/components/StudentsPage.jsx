import { FaUserEdit, FaPlus, FaUser } from 'react-icons/fa';
import { HiUserAdd } from 'react-icons/hi';
import { useState, useEffect, useRef } from 'react';
import { Popup } from './Popup.jsx';

import {List} from './List.jsx';

import {api} from '../api.js';
import {useAuth} from '../hooks/useAuth.jsx';

export  const StudentsPage = () => {
  const fields = [
    {name: "id", isMeta: true},
    {name: 'first name', isMeta: false},
    {name: 'last name', isMeta: false},
    {name: 'grade', isMeta: false},
    {name: 'phone', isMeta: false},
  ];
    
  const [students, setStudents] = useState([]);
  const [studentList, setStudentList] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const list = await api.students.list();
      const displayList = list.map(s => {
        const {teacher_id, ...rest} = s;
        return rest;
      });

      setStudents(list);
      setStudentList(displayList);
    })();
  }, []);

  const onAdd = async (fields) => {
    const errors = [];

    if (!isValidName(fields.first_name))
      errors.push("First name is invalid");

    if (!isValidName(fields.last_name))
      errors.push("Last name is invalid");

    if (!isValidGrade(fields.grade))
      errors.push("grade field is invalid");

    if (!isValidPhone(fields.phone))
      errors.push("phone is invalid");

    if (errors.length === 0) {
      const teacher_id = user.id;
      const response = await api.students.create({...fields, teacher_id});
      if (!response.createdStudent) {
        errors.push("Couldn't create student. Something went wrong");
      } else {
        const {teacher_id, ...created_student} = response.createdStudent;
        setStudentList([...studentList, created_student]);
      }
    }
    return new Promise((resolve) => resolve(errors));
  };

  const onDelete = async (selected) => {
    const deletedIds = selected.reduce((deleted, s, i) => {
      return s ? [...deleted, studentList[i].id]:deleted;
    }, []);

    await deletedIds.forEach(async (id) => {
      await api.students.delete(id);
    });

    setStudentList(selected.reduce((list, s, i) => !s ? [...list, studentList[i]]:list, []));

    return new Promise((resolve) => resolve(null));
  };

  const onEdit = (row, field, value) => {
    return new Promise(async (resolve, reject) => {
      const errors = [];
      if (field === 'first_name' && !isValidName(value)) {
        errors.push("invalid first name supplied");
      }
      else if (field === 'last_name' && !isValidName(value)) {
        errors.push("invalid last name supplied");
      }
      else if (field === "grade" && !isValidGrade(value)) {
        errors.push("invalid grade supplied");
      }
      else if (field === "phone" && !isValidPhone(value)) {
        errors.push("invalid phone supplied");
      }

      const id = studentList[row].id;
      const fields = {[field]: value};

      const response = await api.students.edit(id, fields);

      if (response.message != 'edited successfully') {
        errors.push("something went wrong");
      }

      if (errors.length !== 0) {
        reject(errors);
      }
      else {
        const new_studentList = studentList.map((student, i) => {
          return row == i ? {...student, [field]: value}:student;
        });
        setStudentList(new_studentList);
        resolve(null);
      }
    });
  };

  const isValidName = (value) => value.match(/^[ a-zA-Zא-ת]{2,30}$/);
  const isValidGrade = (value) => value.match(/^\d{1,2}$/);
  const isValidPhone = (value) => value.match(/^[0-9]{10}$/);

  return (
    <div className="students-page content">
      <h2> Manage students </h2>
      <List
        fields={fields}
        rows={studentList}
        
        onAdd={onAdd}
        onDelete={onDelete}
        onEdit={onEdit} />
    </div>
  );
};
