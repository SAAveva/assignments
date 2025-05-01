import { useState } from 'react';

export const Popup = ({show, onHide, ...params}) => {
  show = show === "true" || show === true? true:false;

  const hidePopup = (event) => {
    if (event.target == event.currentTarget)
      onHide(event);
  };

  return show ?
    <div 
      className="popup"
      {...params}
      onClick={hidePopup}
    >
      {params.children}
    </div>
  :null;
};
