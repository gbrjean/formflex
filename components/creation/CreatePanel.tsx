import LeftMenu from "@components/creation/LeftMenu"
import RightMenu from "@components/creation/RightMenu"
import css from "@styles/creation.module.scss"

import { useForm, FormProvider, Controller } from 'react-hook-form';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { mainScreenPointsSchema, mainScreenSchema, mainScreenTextboxSchema, finalScreenSchema } from "@validations/form.validation";
import { useEffect, useState } from "react";
import AnswerBox from "@components/AnswerBox";
import { toast } from "react-toastify";


interface CreatePanelProps {
  setup: State;
  setSetup: React.Dispatch<Action>;
  properties: {
    questionsTypes: any[];
  };
  cachedState: MainScreen[];
}

type SelectedSchema = 
 | typeof mainScreenSchema
 | typeof mainScreenPointsSchema
 | typeof mainScreenTextboxSchema
 | typeof finalScreenSchema



const CreatePanel = ({setup, setSetup, properties, cachedState}: CreatePanelProps) => {

  const [activeScreen, setActiveScreen] = useState<ActiveScreen | null>(null)
  const [isMainScreen, setIsMainScreen] = useState(activeScreen === null || activeScreen.type === 'main_screen')
  // const isMainScreen = activeScreen === null || activeScreen.type === 'main_screen';

  const [MainScreenQuestionTypeName, setMainScreenQuestionTypeName] = useState("")
  // let MainScreenQuestionTypeName = "";

  const [isScorePointsEnabled, setIsScorePointsEnabled] = useState(setup.score_points)
  // const isScorePointsEnabled = setup.score_points;

  const [selectedSchema, setSelectedSchema] = useState<SelectedSchema>(
    isMainScreen
    ? MainScreenQuestionTypeName !== 'Text box'
      ? isScorePointsEnabled
        ? mainScreenPointsSchema
        : mainScreenSchema
      : mainScreenTextboxSchema
    : finalScreenSchema
  )
  // const selectedSchema: SelectedSchema = isMainScreen
  //                                         ? MainScreenQuestionTypeName !== 'Text box'
  //                                           ? isScorePointsEnabled
  //                                             ? mainScreenPointsSchema
  //                                             : mainScreenSchema
  //                                           : mainScreenTextboxSchema
  //                                         : finalScreenSchema;
                  
  
  const INITIAL_MAIN_SCREEN: MainScreen = {
    questions_type: "oJsNUPxDEUf5jf0nc4o8",
    question_type_name: "Multiple answers",
    title: "Set a title",
    description: "",
    data: {
      answers: [],
      correct_answers: []
    },
    allowed_image: false,
  } 

  const POLL_MAIN_SCREEN: MainScreen = {
    questions_type: "0jAccZiYZ2Kt0i04dIay",
    question_type_name: "Bullet answers",
    title: "Main Screen - Poll",
    description: "",
    data: {
      answers: [],
      correct_answers: []
    },
    allowed_image: false,
  } 

  const INITIAL_FINAL_SCREEN: FinalScreen = {
    title: "Set a title",
    description: "",
    score: "",
    allowed_image: false,
  }


  const INITIAL_ANSWER_POINTS: Answer = {
    content: "",
    points: "0",
  }

  const INITIAL_ANSWER: Answer = {
    content: "",
  }

 
  type FormData = z.infer<typeof selectedSchema>;
  const resolver = zodResolver(selectedSchema);

  const methods = useForm<FormData>({
    resolver: resolver,
  });


  const triggerFormSubmission = (action: string) => {
    const screenIndex = activeScreen ? activeScreen.index : 0
    const screenType = activeScreen ? activeScreen.type : "main_screen"

    switch (action) {
      case "title":
        methods.trigger('title');
        if(!methods.formState.errors.title){
          if(screenType == "main_screen"){
            setSetup({ type: "CHANGE_MAIN_SCREEN_INPUT", payload: { index: screenIndex, field: "title", value: methods.getValues('title') } });
          } else {
            setSetup({ type: "CHANGE_FINAL_SCREEN_INPUT", payload: { index: screenIndex, field: "title", value: methods.getValues('title') } });
          }
        }
        break;
      case "description":
        methods.trigger('description');
        if(!methods.formState.errors.description){
          if(screenType == "main_screen"){
            setSetup({ type: "CHANGE_MAIN_SCREEN_INPUT", payload: { index: screenIndex, field: "description", value: methods.getValues('description') } });
          } else {
             setSetup({ type: "CHANGE_FINAL_SCREEN_INPUT", payload: { index: screenIndex, field: "description", value: methods.getValues('description') } });
          }
        }
        break;
      case "answers":
        // @ts-ignore
        methods.trigger('answers');
        // @ts-ignore
        if(!methods.formState.errors.answers){
          // @ts-ignore
          setSetup({ type: "CHANGE_ANSWERS", payload: { index: screenIndex, value: methods.getValues('answers') } });
        }
        break;
      case "final_score":
        // @ts-ignore
        methods.trigger('score');
        // @ts-ignore
        if(!methods.formState.errors.score){
          // @ts-ignore
          setSetup({ type: "CHANGE_FINAL_SCREEN_INPUT", payload: { index: screenIndex, field: "score", value: methods.getValues('score') } });
        }
    }
  };

  const triggerAddMainScreen = (valueObject?: MainScreen) => {
    if(setup.type_name == "Poll" && setup.main_screens.length > 0){
      toast.error("The Poll form type can have only 1 main screen")
    } else {
      if(valueObject === undefined){
        setSetup({ type: "ADD_SCREEN", 
                  payload: {
                    name: "main_screens", 
                    value: INITIAL_MAIN_SCREEN
                  }});
      } else {
        setSetup({ type: "ADD_SCREEN", 
                   payload: {
                    name: "main_screens", 
                    value: valueObject
                   }});
      }
      setActiveScreen({type: 'main_screen', index: setup.main_screens.length})
    }
  }

  const triggerAddFinalScreen = () => {
    if(setup.type_name == "Poll" && setup.final_screens.length > 0){
      toast.error("The Poll form type can have only 1 final screen")
    } else{
      setSetup({ type: "ADD_SCREEN", payload: { name: "final_screens", value: INITIAL_FINAL_SCREEN } });
      setActiveScreen({type: 'final_screen', index: setup.final_screens.length})
    }
  }

  const triggerChangeMainScreenInput = (key: number, field: string, value: any) => {
    setSetup({
      type: "CHANGE_MAIN_SCREEN_INPUT",
      payload: { index: key, field: field, value: value },
    });
  }

  const triggerChangeFinalScreenInput = (key: number, field: string, value: any) => {
    setSetup({
      type: "CHANGE_FINAL_SCREEN_INPUT",
      payload: { index: key, field: field, value: value },
    });
  }

  const triggerAddAnswer = (key: number) => {
    if(setup.score_points) {
      setSetup({ type: "ADD_ANSWER", payload: { index: key , value: INITIAL_ANSWER_POINTS } });
    } else {
      setSetup({ type: "ADD_ANSWER", payload: { index: key , value: INITIAL_ANSWER } });
    }
  }

  const triggerDeleteAnswer = (screen: number, answer: number) => {
    setSetup({ type: "REMOVE_ANSWER", payload: { screenIndex: screen , answerIndex: answer } });
    setSetup({ type: "CHANGE_CORRECT_ANSWERS", payload: { index: screen, value: [] } });
  }

  const triggerDeleteMainScreen = (key: number) => {
    let newActiveScreen = activeScreen ? activeScreen.index : 0
    if(activeScreen && activeScreen.index <= 0){
      newActiveScreen = 0
    } else if (activeScreen) {
      newActiveScreen = activeScreen.index-1
    }
    setActiveScreen({type: 'main_screen', index: newActiveScreen })
    setSetup({ type: "REMOVE_MAIN_SCREEN", payload: key })
  }

  const triggerFinalDeleteScreen = (key: number) => {
    let newActiveScreen = activeScreen ? activeScreen.index : 0
    if(activeScreen && activeScreen.index <= 0){
      const lastMainScreen = setup.main_screens.length-1
      setActiveScreen({type: 'main_screen', index: lastMainScreen })
    } else if (activeScreen) {
      newActiveScreen = activeScreen.index-1
      setActiveScreen({type: 'final_screen', index: newActiveScreen })
    }
    setSetup({ type: "REMOVE_FINAL_SCREEN", payload: key })
  }


  useEffect(() => {
    const newSelectedSchema = isMainScreen
                              ? MainScreenQuestionTypeName != 'Text box'
                                ? isScorePointsEnabled
                                  ? mainScreenPointsSchema
                                  : mainScreenSchema
                                : mainScreenTextboxSchema
                              : finalScreenSchema;
  
    setSelectedSchema(newSelectedSchema);
  }, [isMainScreen, MainScreenQuestionTypeName, isScorePointsEnabled]);


  useEffect(() => {
    if(setup.type_name == "Poll"){
      triggerAddMainScreen(POLL_MAIN_SCREEN)
    }
  }, [setup.type_name])
  


  useEffect(() => {
    const screenIndex = activeScreen ? activeScreen.index : 0;
    const screenType = activeScreen ? activeScreen.type : "main_screen"

    let currentTitle = ""
    let currentDescription = ""


    if(screenType == "main_screen" && setup.main_screens.length > 0){

      setMainScreenQuestionTypeName(activeScreen ? setup.main_screens[screenIndex].question_type_name : "")
      const CachedQuestionTypeName = activeScreen ? cachedState[screenIndex]?.question_type_name : ""

      if(MainScreenQuestionTypeName != CachedQuestionTypeName){
        setSetup({ type: "CHANGE_CORRECT_ANSWERS", payload: { index: screenIndex, value: [] } });
      }

      currentTitle = setup.main_screens[screenIndex]?.title ? setup.main_screens[screenIndex].title : ""
      currentDescription = setup.main_screens[screenIndex]?.description ? setup.main_screens[screenIndex].description : "";
    
      if(MainScreenQuestionTypeName != "Text box" && setup.main_screens[screenIndex]?.data?.answers){
        // @ts-ignore
        methods.setValue("answers", setup.main_screens[screenIndex].data.answers as any[])
        // @ts-ignore
        methods.trigger('answers');
      }
    
      if(MainScreenQuestionTypeName != "Text box" && setup.main_screens[screenIndex]?.data?.correct_answers){
        // @ts-ignore
        methods.setValue("correct_answers", setup.main_screens[screenIndex].data.correct_answers);
        // @ts-ignore
        methods.trigger('correct_answers');
      }

    }

    if(screenType == "final_screen"){

      currentTitle = setup.final_screens[screenIndex]?.title ? setup.final_screens[screenIndex].title : ""
      currentDescription = setup.final_screens[screenIndex]?.description ? setup.final_screens[screenIndex].description : "";
      
      // @ts-ignore
      if(methods.getValues("answers")){
        // @ts-ignore
        methods.setValue("answers", undefined)
      }
      // @ts-ignore
      if(methods.getValues("correct_answers")){
        // @ts-ignore
        methods.setValue("correct_answers", undefined)
      }
      
    }

    methods.setValue("title", currentTitle)
    methods.trigger('title');
    methods.setValue("description", currentDescription)
    methods.trigger('description');

  }, [activeScreen, setup])

    

  useEffect(() => {
    console.log(JSON.stringify(methods.watch(), null, 2))
  }, [methods.watch()])


  return (
    <div className={css.create_panel}>

      <FormProvider {...methods}>
        <LeftMenu 
          triggerAddMainScreen={triggerAddMainScreen}
          triggerAddFinalScreen={triggerAddFinalScreen}
          triggerDeleteMainScreen={triggerDeleteMainScreen}
          triggerFinalDeleteScreen={triggerFinalDeleteScreen} 
          setActiveScreen={setActiveScreen}
          screenObjIndex={activeScreen ? activeScreen.index : 0}
          screenObjType={activeScreen ? activeScreen.type : "main_screen"}
          mainScreens={setup.main_screens} 
          finalScreens={setup.final_screens} 
          formType={setup.type_name}
        />
        <div className={css.canvas_wrapper}>
          <div className={css.canvas}>
            
            <div className={`${css.canvas_content} ${setup.color_palette}`}>
              
              { setup.main_screens.length > 0 && 
                <>

                { 
                  activeScreen ? (activeScreen.type === "main_screen"
                    ? (setup.main_screens[activeScreen.index]?.image != "" && <img src={setup.main_screens[activeScreen.index]?.image} alt="" />)
                    : (setup.final_screens[activeScreen.index]?.image != "" && <img src={setup.final_screens[activeScreen.index]?.image} alt="" />)
                  ) : (setup.main_screens.length === 0 ? null : (setup.main_screens[0]?.image != null && <img src={setup.main_screens[0]?.image} alt="" />) )

                }

                
                <div>
                  <Controller
                    name="description"
                    control={methods.control}
                    defaultValue={
                      activeScreen ? (activeScreen.type === "main_screen"
                        ? setup.main_screens[activeScreen.index].description
                        : setup.final_screens[activeScreen.index].description
                      ) : (setup.main_screens.length === 0 ? "" : setup.main_screens[0].description)
                    }
                    render={({ field }) => (
                      <textarea 
                        {...field}
                        placeholder="Type the description..."
                        onChange={(e) => {
                          field.onChange(e);
                          triggerFormSubmission("description");
                        }}
                      />
                    )}
                  />
                  
                  {methods.formState.errors.description && (
                    <p className="error">{methods.formState.errors.description.message}</p>
                  )}
                </div>
                
                { activeScreen ? (
                    (setup.main_screens[activeScreen.index].data.answers.length > 0 && activeScreen.type == "main_screen") &&
                      <div className="answer-box-wrapper">
                        {setup.main_screens[activeScreen.index].data.answers.map((answer, index) => (
                          <AnswerBox index={index} content={answer.content} />
                        ))}
                      </div>
                ) : (
                    setup.main_screens[0].data.answers.length > 0 &&
                    <div className="answer-box-wrapper">
                      {setup.main_screens[0].data.answers.map((answer, index) => (
                        <AnswerBox index={index} content={answer.content} />
                      ))}
                    </div>
                )}

                </>
              }

            </div>

          </div>
        </div>
        <RightMenu 
          setup={setup}
          setSetup={setSetup}
          triggerSubmit={triggerFormSubmission} 
          triggerChangeScreenInput={ activeScreen ? (activeScreen.type === "main_screen"
              ? triggerChangeMainScreenInput
              : triggerChangeFinalScreenInput
            ) : triggerChangeMainScreenInput}
          triggerAddAnswer={triggerAddAnswer}
          triggerDeleteAnswer={triggerDeleteAnswer}
          screenObj={activeScreen ? (activeScreen.type === "main_screen"
              ? setup.main_screens[activeScreen.index]
              : setup.final_screens[activeScreen.index]
            ) : (setup.main_screens.length === 0 ? undefined : setup.main_screens[0])}
          screenObjIndex={activeScreen ? activeScreen.index : 0}
          screenObjType={activeScreen ? activeScreen.type : "main_screen"}
          properties={properties}
        />
      </FormProvider>

    </div>
  )
}

export default CreatePanel