import { useEffect, useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form';

import css from "@styles/creation.module.scss"
import Answer from './Answer';
import { indexToLabel } from '@utils/indexToLabel';
import { toast } from 'react-toastify';


type Props = {
  setup: {
    color_palette: string;
    score_points: boolean;
    type_name: string;
  },
  setSetup: React.Dispatch<Action>;
  properties: {
    questionsTypes: any[];
  };
  screenObj?: MainScreen | FinalScreen;
  screenObjIndex: number;
  screenObjType: "main_screen" | "final_screen";
  triggerSubmit: (action: string) => void;
  triggerChangeScreenInput: (key: number, field: string, value: any) => void;
  triggerAddAnswer: (key: number) => void;
  triggerDeleteAnswer: (screen: number, answer: number) => void;
}

const RightMenu = ({
  setup,
  setSetup,
  properties,
  screenObj, 
  screenObjIndex, 
  screenObjType,
  triggerChangeScreenInput, 
  triggerSubmit, 
  triggerAddAnswer, 
  triggerDeleteAnswer,
}: Props) => {

  let [menu, setMenu] = useState(1)  

  useEffect(() => {
    setMenu(2)
  }, [screenObjType])
  

  const { control, formState, setValue } = useFormContext();


  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.options[e.target.selectedIndex];

    if(setup.type_name == "Survey" && selectedOption.dataset.name == "Text box" && screenObjIndex != 0) {
      toast.error("Only the first screen can have this type (Text box) for Form type 'Survey'")
    } else if(setup.type_name == "Poll"){
      toast.error("The screen type of Form type 'Poll' can't be changed. Choose another Form type")
      e.target.value = "0jAccZiYZ2Kt0i04dIay"
    } else {
      triggerChangeScreenInput(screenObjIndex, e.target.name, e.target.value)
      triggerChangeScreenInput(screenObjIndex, "question_type_name", selectedOption.dataset.name)
    }
  }

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.id == "score_points"){
      setSetup({ type: "CHANGE_INPUT", payload: {name: e.target.id, value: e.target.checked} })
    }

    if(e.target.id == "allowed_image"){
      triggerChangeScreenInput(screenObjIndex, e.target.id, e.target.checked)
      if(!e.target.checked){
        triggerChangeScreenInput(screenObjIndex, "image", "")
        setValue("image", "")
      }
    }
  }

  const handleCorrectAnswers = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(screenObj){
      let newCorrectAnswers: any[] = [...screenObj.data.correct_answers]

      if(screenObj.question_type_name == "Multiple answers"){
        newCorrectAnswers = [...screenObj.data.correct_answers]
        if (e.target.checked) {
          // Add the value to the correct_answers array
          newCorrectAnswers.push(e.target.value);
        } else {
          // Remove the value from the correct_answers array
          const index = newCorrectAnswers.indexOf(e.target.value);
          if (index !== -1) {
            newCorrectAnswers.splice(index, 1);
          }
        }
      } else {
        newCorrectAnswers = [e.target.value]
      }

      setSetup({ type: "CHANGE_CORRECT_ANSWERS", payload: { index: screenObjIndex, value: newCorrectAnswers } });
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    e.preventDefault();

    const fileReader = new FileReader()

    if(e.target.files && e.target.files.length > 0){
      const file = e.target.files[0]

      if(!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || '';
        fieldChange(imageDataUrl)
        triggerChangeScreenInput(screenObjIndex, "image", imageDataUrl)
      }

      fileReader.readAsDataURL(file)

    }

  }


  return (
    <div className={css.right_menu}>
      
      <ul className={css.nav}>
        <li className={menu == 1 ? `${css.nav_menu} ${css.active}`: `${css.nav_menu}`} onClick={() => setMenu(1)}>Form</li>
        <li className={menu == 2 ? `${css.nav_menu} ${css.active}`: `${css.nav_menu}`} onClick={() => setMenu(2)}>Screen</li>
        { (screenObj?.question_type_name != "Text box" && screenObjType == "main_screen") && <li className={menu == 3 ? `${css.nav_menu} ${css.active}`: `${css.nav_menu}`} onClick={() => setMenu(3)}>Customize</li> }
      </ul>

      <div className={ menu == 1 ? `${css.screen_menu} ${css._active}` : `${css.screen_menu}` }>

        { (screenObjType == "main_screen" && setup.type_name != "Poll") &&
          <div className={css.input_group_text}>

            <div className={css.input_group_toggle}>
              <span className={css.menu_title}>Score points</span>
              <label className="compare-switch">
                {/* <input type="checkbox" checked={switchInput} onChange={() => toggleSwitch()} /> */}
                <input type="checkbox" id="score_points" onChange={handleToggleChange} />
                <span className="slider"></span>
              </label>
            </div>

          </div>
        }

        <div className={css.color_palette_group}>
          <span className={css.menu_title}>Color palette</span>

          <div className={css.color_palette_wrapper}>

            <div className={css.color_palette}>
              <input type="radio" id="palette-1" name="color_palette" 
                checked={setup.color_palette == "palette-1"}
                onChange={(e) => setSetup({ type: "CHANGE_INPUT", payload: {name: e.target.name, value: e.target.id} })}
              />

              <div className={`${css.palette} palette-1`}>
                <div className="color-1"></div>
                <div className="color-2"></div>
                <div className="color-3"></div>
              </div>

            </div>

            <div className={css.color_palette}>
              <input type="radio" id="palette-2" name="color_palette"
                checked={setup.color_palette == "palette-2"}
                onChange={(e) => setSetup({ type: "CHANGE_INPUT", payload: {name: e.target.name, value: e.target.id} })}
              />

              <div className={`${css.palette} palette-2`}>
                <div className="color-1"></div>
                <div className="color-2"></div>
                <div className="color-3"></div>
              </div>

            </div>

            <div className={css.color_palette}>
              <input type="radio" id="palette-3" name="color_palette"
                checked={setup.color_palette == "palette-3"}
                onChange={(e) => setSetup({ type: "CHANGE_INPUT", payload: {name: e.target.name, value: e.target.id} })}
              />

              <div className={`${css.palette} palette-3`}>
                <div className="color-1"></div>
                <div className="color-2"></div>
                <div className="color-3"></div>
              </div>

            </div>

          </div>
          
        </div>

      </div>

      { screenObj ? (
        <>
        <div className={ menu == 2 ? `${css.screen_menu} ${css._active}` : `${css.screen_menu}` }>

          { screenObjType == "main_screen" &&
            <div className={css.input_group_text}>
              <label htmlFor="questions_type" className={css.menu_title}>Type</label>
              <select id="questions_type" name="questions_type" value={screenObj.questions_type} onChange={handleSelectChange}>
                <option value="" disabled>Select a type</option>
                { properties.questionsTypes.map(type => (
                  <option value={type.id} data-name={type.name}>{type.name}</option>
                ))}
              </select>
            </div>
          }

          <div className={css.input_group_text}>
            <label htmlFor="title" className={css.menu_title}>Title</label>
            
            <div className={css.controller}>
              <Controller
                name="title"
                control={control}
                defaultValue={screenObj.title}
                render={({ field }) => (
                  <input {...field} type="text" placeholder={screenObj.title}
                    onChange={(e) => {
                      field.onChange(e);
                      triggerSubmit("title");
                    }}
                  />
                )}
              />
              
              {formState.errors.title && (
                <p className="error">{formState.errors.title.message as string}</p>
              )}
            </div>

          </div>
          

          { (screenObjType == "final_screen" && setup.score_points) && 
            <div className={css.input_group_text_inline}>
              <span className={css.menu_title}>Target score points</span>
              <Controller
                name="score"
                control={control}
                defaultValue={screenObj.score}
                render={({ field }) => (
                  <input {...field} type="text" 
                    onChange={(e) => {
                      field.onChange(e);
                      triggerSubmit("final_score");
                    }}
                  />
                )}
              />
            </div>
          }

          <div className={css.input_group_toggle}>
            <span className={css.menu_title}>Image</span>
            <label className="compare-switch">
              <input type="checkbox" 
                id="allowed_image"
                checked={screenObj.allowed_image ? true : false} 
                onChange={handleToggleChange} 
              />
              <span className="slider"></span>
            </label>
          </div>

          { screenObj.allowed_image && (
            <div className={css.input_group_text}>
              <Controller
                name="image"
                control={control}
                defaultValue={screenObj.image ? screenObj.image : ""}
                render={({ field }) => (
                  <input
                    type="file"
                    accept="image/*"
                    placeholder="Upload image"
                    onChange={(e) => handleImageChange(e, field.onChange)}
                  />
                )}
              />
            </div>
          )}


        </div>

        { (screenObj?.question_type_name != "Text box" && screenObjType == "main_screen") && 
          <div className={ menu == 3 ? `${css.customize_menu} ${css._active}` : `${css.customize_menu} `}>

            <div className={css.input_group_text}>
              <div className={css.menu_title_wrapper}>
                <span className={css.menu_title}>Answers</span>
                <button className="btn btn-gray" onClick={() => triggerAddAnswer(screenObjIndex)}>+</button>
              </div>

              <div className={css.question_group}>

                {screenObj && 'data' in screenObj && (
                  screenObj.data.answers.length === 0 ? (
                    <p>You must add some answers.</p>
                  ) : (
                    screenObj.data.answers.map((answer: Answer, key: number) => (
                      <Answer 
                        key={`ans-${screenObjIndex}${key}`} 
                        index={key}
                        screenIndex={screenObjIndex}
                        label={indexToLabel(key)} 
                        content={answer.content} 
                        points={answer.points !== null ? answer.points : undefined} 
                        triggerSubmit={triggerSubmit} 
                        triggerDeleteAnswer={triggerDeleteAnswer}
                      />
                    ))
                  )
                )}
                

              </div>

              <button className="btn btn-gray" onClick={() => triggerAddAnswer(screenObjIndex)}>+</button>

            </div>

            <div className={css.customize_submenu}>
              <div className={css.input_group_text}>

                <div className={css.menu_title_wrapper}>
                  <span className={css.menu_title}>Correct answers</span>
                </div>

                <div className={css.answer_list}>

                  { screenObj.data.answers && screenObj.data.answers.length > 0 ? (
                      screenObj.data.answers.map((_: Answer, key: number) => (
                        <label className={css.answer}>
                          { screenObj.question_type_name == "Multiple answers" ? (
                            <input type="checkbox" name="correct_answers[]" value={indexToLabel(key)}
                              onChange={handleCorrectAnswers}
                              checked={screenObj.data.correct_answers.includes(indexToLabel(key))}
                            />
                          ) : (
                            <input type="radio" name="correct_answers" value={indexToLabel(key)}
                              onChange={handleCorrectAnswers}
                              checked={screenObj.data.correct_answers[0] == indexToLabel(key)}
                            />
                          )}
                          <div className={css.answer_checkbox}>{indexToLabel(key)}</div>
                        </label>
                      ))
                  ) : null}


                </div>

                {screenObj.data.answers.length > 0 && formState.errors.correct_answers && (
                  <p className="error">{formState.errors.correct_answers.message as string}</p>
                )}

              </div>
            </div>

          </div>
        }

        </>
      ) : (
        menu !== 1 && <p style={{marginTop: '2rem'}}>Add a screen first</p>
      )}
      
    </div>
  )
}

export default RightMenu