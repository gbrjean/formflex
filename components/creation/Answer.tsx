import TrashIcon from "@public/assets/icons/TrashIcon";
import css from "@styles/creation.module.scss"
import { useEffect } from "react";

import { useFormContext, Controller } from 'react-hook-form';

type Props = {
  index: number;
  screenIndex: number;
  label: string;
  content: string;
  points?: string;
  triggerSubmit: (action: string) => void;
  triggerDeleteAnswer: (screen: number, answer: number) => void;
}

const Answer = ({index, screenIndex, label, content, points, triggerSubmit, triggerDeleteAnswer}: Props) => {

  const { control, formState, setValue } = useFormContext();

  useEffect(() => {
    setValue(`answers[${index}].content`, content)
    points !== undefined && setValue(`answers[${index}].points`, points)
  }, [])
  

  const answerError = Array.isArray(formState.errors.answers) ? formState.errors.answers[index] : undefined;

  return (
    <div className={css.question_group_item}>
      <div className={css.input_group_text}>
        <div className={css.input_group_text_inline}>
          <span>Answer {label}</span>
          <div className={css.screen_actions} onClick={() => triggerDeleteAnswer(screenIndex, index)}>
            <TrashIcon />
          </div>
        </div>

        <div className={css.controller}>
          <Controller
            name={`answers[${index}].content`}
            control={control}
            defaultValue={content}
            render={({ field }) => (
              <input type="text" {...field}
                onChange={(e) => {
                  field.onChange(e);
                  triggerSubmit("answers");
                }}
              />
            )}
          />

          {answerError && answerError.content?.message && (
            <p className="error">{answerError.content.message}</p>
          )}
        </div>

      </div>

      { points !== undefined && (
        <div className={css.input_group_text_inline}>
          <label htmlFor="points">Points</label>
         
          <div className={css.controller_relative}>
            <Controller
              name={`answers[${index}].points`}
              control={control}
              defaultValue={points}
              render={({ field }) => (
                <input type="text" {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    triggerSubmit("answers");
                  }}
                />
              )}
            />

            {answerError && answerError.points?.message && (
              <p className="error">{answerError.points.message}</p>
            )}
          </div>

        </div>
      )}

    </div>
  )
}

export default Answer