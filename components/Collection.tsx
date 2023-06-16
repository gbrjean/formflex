import { useState, useEffect, useRef } from "react";

import CheckIcon from "@public/assets/icons/CheckIcon";
import CrossIcon from "@public/assets/icons/CrossIcon";
import EditIcon from "@public/assets/icons/EditIcon";
import TrashIcon from "@public/assets/icons/TrashIcon";
import css from "@styles/collections.module.scss"

type DataType = {
  id: string;
  title: string;
  forms_no: number;
}

type CollectionProps = {
  data: DataType;
  deleteCollection: (id: string) => void;
  updateCollection: (id: string, name: string) => void;
}

export const Collection = ({data, deleteCollection, updateCollection} : CollectionProps) => {

  let [isEditable, setIsEditable] = useState(false)
  let [newName, setNewName] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditable && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditable]);

  return (
    <div className={css.collection}>
      <div className={css.collection_heading}>
        <div className={css.collection_title}>
          { !isEditable ? <span>{data.title}</span> : (
            <textarea ref={textareaRef} name="name" id="name" defaultValue={data.title} onChange={(e) => setNewName(e.target.value)}></textarea>
          )}
          { isEditable && (
              <div className={css.collection_title_actions}>
                <div onClick={() => {updateCollection(data.id, newName); setIsEditable(false)} }><CheckIcon /></div>
                <div onClick={() => setIsEditable(false)}><CrossIcon /></div>
              </div>
            )
          }
        </div>
        { !isEditable && (
            <div className={css.collection_actions}>
              <div onClick={() => setIsEditable(true)}><EditIcon /></div>
              <div onClick={() => deleteCollection(data.id)}><TrashIcon /></div>      
            </div>
          )
        }
      </div>
      <div className={css.collection_data}>
        <span>{data.forms_no} forms</span>
        <button className="btn btn-black">+</button>
      </div>
    </div>
  )
}
