import css from "@styles/creation.module.scss"
import Link from "next/link"
import { useRouter } from "next/navigation";

interface TypePanelProps {
  togglePanel: (index: number) => void;
  setup: {
    title: string;
    type_id: string;
    collection_id: string;
  };
  setSetup: React.Dispatch<{
    type: "CHANGE_INPUT";
    payload: {
      name: string;
      value: string | number;
    };
  }>;
  properties: {
    collections: any[];
    formTypes: any[];
  };
  isEditable?: boolean;
}

const TypePanel = ({togglePanel, setup, setSetup, properties, isEditable} : TypePanelProps) => {

  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSetup({
      type: "CHANGE_INPUT", 
      payload: {name: e.target.name, value: e.target.value},
    })

    if(e.target.name == "type_id"){

      const selectedOption = e.target.querySelector(`option[value="${e.target.value}"]`);
      const typeName = selectedOption?.getAttribute("data-name") || "";

      setSetup({
        type: "CHANGE_INPUT", 
        payload: {name: 'type_name', value: typeName},
      })
    }

  }

  return (
    <div className={css.type_panel}>
      <div className={css.wrapper}>
        <span className={css.title}>Initial setup</span>

        <div className={css.form}>
          <div className={css.form_input}>
            <label htmlFor="title">Form name</label>
            <input type="text" id="title" name="title" defaultValue={setup.title} onChange={handleInputChange} autoComplete="new-form" />
          </div>
          <div className={css.form_input}>
            <label htmlFor="type">Form type</label>
            { properties.formTypes.length > 0 && (
              <select name="type_id" id="type" defaultValue={setup.type_id} onChange={handleInputChange} >
                <option value="" disabled>Select a type</option>
                { properties.formTypes.map(type => (
                  <option value={type.id} data-name={type.name}>{type.name}</option>
                ))}
              </select>
            )}
          </div>
          <div className={css.form_input}>
            <label htmlFor="collection">Collection</label>
              { properties.collections.length === 0 ? (
                <p>Please add a collection <b><Link href="collections">here</Link></b></p>
              ) : 
                <select name="collection_id" id="collection" defaultValue={setup.collection_id} onChange={handleInputChange} >
                  <option value="" disabled>Select a collection</option>
                  { properties.collections.map(collection => (
                    <option value={collection.id}>{collection.title}</option>
                  ))}
                </select>
              }
          </div>
        </div>

        <div className={css.actions}>
          <button className="btn btn-main" onClick={() => togglePanel(2)}>{isEditable ? 'Continue' : 'Create'}</button>
          <button className="btn btn-gray" onClick={() => router.back()}>Back</button>
        </div>

      </div>
    </div>
  )
}

export default TypePanel