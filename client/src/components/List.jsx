import { useRef, useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

import { Popup } from './Popup';

export const List = ({fields, rows, onAdd, onDelete, onEdit}) => {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [serverError, setServerError] = useState(false);

  const displayedFields = fields.filter(f => !f.isMeta);

  useEffect(() => {
    setSelected(Array(rows.length).fill(false));
  }, [rows]);

  const openAddPopup = () => {
    setShowAddPopup(true);
  };

  const closeAddPopup = () => {
    setShowAddPopup(false);
    setFormErrors([]);
  };

  const listAdd = () => {
    const values = {};
    form_refs.map(input => {
      const name = input.current.dataset.fieldName.replace(' ', '_');
      const value = input.current.value;
      return values[name] = value;
    });

    onAdd(values).then(errors => {
      if (errors.length === 0) {
        setSelected([...selected, false]);
        closeAddPopup();
      }
      else {
        setFormErrors(errors);
      }
    });
  };

  const onSelectAll = () => {
      setSelectAll(!selectAll);
      setSelected(Array(rows.length).fill(!selectAll));
  };

  const onDeleteSelected = () => {
    onDelete(selected).then(() => {
      const new_selected = Array.from(selected).filter(n => !(n === true));
      setSelected(new_selected);
    }).catch(() => setServerError(true));
  }

  const cellChanged = (row, field, element) => {
    field = field.replace(/ /, '_');
    onEdit(row, field, element.textContent)
      .then(() => element.textContent = rows[row][field])
      .catch(errors => alert(errors));
  };

  const form_ref = useRef(null);
  const form_refs = Array.from(displayedFields.map(field => useRef(null)));

  return (
    <div className="list">
      <Popup show={showAddPopup} onHide={closeAddPopup}>
        <form className="form" ref={form_ref}>
          <div className="form-errors">
            {formErrors ? formErrors.map((e, key) => <div className="form-error" key={key}>{e}</div>):null}
          </div>
          {displayedFields.map((field, key) => {
            return (
              <div key={key} className="form-field">
                <label htmlFor={field.name}>{field.name}</label>
                <input 
                  data-field-name={field.name} 
                  ref={form_refs[key]} 
                  name={field.name} 
                  type="text"
                />
              </div>
            );
          })}
          <button type="button" onClick={listAdd}><FaPlus />Add</button>
        </form>
      </Popup>
      {serverError ? <div>Oops.. we encountered an unrecoverable error</div>:null }
      <div className="list-actions">
        <menu className="list-group-actions">
          <a onClick={onSelectAll}>select all</a>
          {onDelete ? <a onClick={onDeleteSelected}>delete</a>:null}
        </menu>
        <menu className="list-single-actions">
          {onAdd ? <a onClick={openAddPopup}><FaPlus /> add</a>:null}
        </menu>
      </div>
      {rows.length == 0 ? <p>No entries</p>:<table className="list-table">
        <thead>
        <tr className="list-row">
          <th>
            <input
              type="checkbox" 
              checked={selectAll}
              onChange={onSelectAll}
            />
          </th>
          {fields.map((field, key) => {
            return (
              <th className="list-cell" key={key}>{field.name}</th>
            );
          })}
        </tr>
        </thead>
        <tbody>
        {rows.map((row, row_idx) => {
          return (
            <tr key={row_idx} className="list-row">
              <td className="list-cell">
                <input
                  type="checkbox"
                  checked={selected[row_idx]}
                  onChange={() => {
                    setSelected(selected.map((item, i) => {
                      return i == row_idx ? !item:item;
                    }));
                  }}
                />
              </td>
              {Object.keys(row).map((cell, col_idx) => {
                return (
                  <td
                    key={col_idx}
                    className="list-cell" 
                    role="input"
                    contentEditable={!fields[col_idx].isMeta}
                    suppressContentEditableWarning="true"
                    onBlur={(event) => {
                      cellChanged(row_idx, fields[col_idx].name, event.currentTarget)
                    }}>
                    {row[cell]}
                  </td>
                );
              })}
            </tr>
          );
        })}
        </tbody>
      </table>}
    </div>
  );
};

export default {List};
