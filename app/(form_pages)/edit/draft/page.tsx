"use client"

import { useState, useReducer, useEffect } from 'react'
import { useAuth } from '@context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify'

import css from "@styles/creation.module.scss"

import Header from "@components/creation/Header"
import TypePanel from "@components/creation/TypePanel"
import CreatePanel from "@components/creation/CreatePanel"
import PreviewPanel from "@components/creation/PreviewPanel"
import { isEmptyString } from '@utils/isEmptyString';

type PropertyType = {
  collections: any[];
  formTypes: any[];
  questionsTypes: any[];
};

const FormCreation = () => {

  const { user } = useAuth()

  const router = useRouter()

  const searchParams = useSearchParams()
  const formId = searchParams.get('id')

  if(!formId){
    router.push('/')
  }



  const [properties, setProperties] = useState<PropertyType>({
    collections: [],
    formTypes: [],
    questionsTypes: []
  })

  const getProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      let data = await response.json()
      return {
        formTypes: data.formTypes,
        questionsTypes: data.questionsTypes,
      };
    } catch (error) {
      console.error(error)
      return {
        formTypes: [],
        questionsTypes: [],
      };
    }
  }

  const getCollections = async () => {
    try{
      const response = await fetch('/api/collections', {
        method: 'POST',
        body: JSON.stringify({
          userId: user?.uid
        })
      })
      let data = await response.json()
      return { collections: data };
    } catch(error){
      console.error(error)
      return { collections: [] };
    }
  }

  useEffect(() => {
    Promise.all([getCollections(), getProperties()])
    .then((results) => {
      const [collectionsData, propertiesData] = results;
      setProperties({
        ...propertiesData,
        ...collectionsData,
      });
    })
    .catch((error) => {
      console.error(error);
    })
  }, [])

  let [panel, setPanel] = useState(1)


  const INITIAL_SETUP: State = {
    completions: 0,
    exits: 0,
    final_screens: [],
    main_screens: [],
    mid_completion_exits: 0,
    questions_no: 0,
    title: "", //INPUT
    type_id: "", //INPUT
    type_name: "",
    collection_id: "", //INPUT
    user_id: user?.uid, 
    views: 0,
    color_palette: "palette-1",
    score_points: false,
  }

  const [formData, setFormData] = useState<State>(INITIAL_SETUP)

  const getFormData = async () => {
    try {
      const response = await fetch(`/api/form/edit-draft/${formId}`)
      let data = await response.json()
      setFormData(data)
    } catch(error){
      router.push("/")
    }
  }

  useEffect(() => {
    getFormData()
  }, [])
  


  const setupReducer = (state: State, action: Action): State => {
    switch(action.type){
      case "CHANGE_INPUT":
        if(action.payload.name == 'score_points'){
          const updatedMainScreens = state.main_screens.map((screen) => ({
            ...screen,
            data: {
              ...screen.data,
              answers: screen.data.answers.map((answer) => 
                action.payload.value 
                 ? { ...answer, points: "0" }
                 : (({ points, ...rest }) => rest)(answer)
              ),
            },
          }));

          return {
            ...state,
            [action.payload.name]: action.payload.value,
            main_screens: updatedMainScreens,
          };
        } else {
          return {
            ...state,
            [action.payload.name]: action.payload.value
          };
        }
      case "ADD_SCREEN":
        return {
          ...state,
          [action.payload.name]: [...state[action.payload.name], action.payload.value]
        };
      case "CHANGE_MAIN_SCREEN_INPUT":
        return {
          ...state,
          main_screens: state.main_screens.map((mainScreen, index) =>
            index === action.payload.index
              ? { ...mainScreen, [action.payload.field]: action.payload.value }
              : mainScreen
          ),
        };
        // case "CHANGE_MAIN_SCREEN_INPUT": {
      //   const updatedMainScreens = [...state.main_screens];
      //   const updatedMainScreen = { ...updatedMainScreens[action.payload.index] };

      //   updatedMainScreen[action.payload.field] = action.payload.value;
      //   updatedMainScreens[action.payload.index] = updatedMainScreen;

      //   return {
      //     ...state,
      //     main_screens: updatedMainScreens,
      //   };
      // }
      case "CHANGE_FINAL_SCREEN_INPUT":
        return {
          ...state,
          final_screens: state.final_screens.map((finalScreen, index) =>
            index === action.payload.index
              ? {...finalScreen, [action.payload.field]: action.payload.value}
              : finalScreen
          ),
        };
      case "ADD_ANSWER": {
        return {
          ...state,
          main_screens: state.main_screens.map((mainScreen, index) =>
            index === action.payload.index
             ? {
                ...mainScreen,
                data: {
                  ...mainScreen.data,
                  answers: [...mainScreen.data.answers, action.payload.value]
                },
               }
             : mainScreen
          ),
        };
      }
      // case "ADD_ANSWER": {
      //   const updatedMainScreens = [...state.main_screens];
      //   const updatedMainScreen = { ...updatedMainScreens[action.payload.index] };

      //   updatedMainScreen.data.answers.push(action.payload.value);
      //   updatedMainScreens[action.payload.index] = updatedMainScreen;

      //   return {
      //     ...state,
      //     main_screens: updatedMainScreens,
      //   };
      // }
      case "CHANGE_ANSWERS": {
        return {
          ...state,
          main_screens: state.main_screens.map((mainScreen, index) => 
            index === action.payload.index
             ? {
                ...mainScreen,
                data: {
                  ...mainScreen.data,
                  answers: action.payload.value,
                },
               }
             : mainScreen
          ),
        };
      }
      case "CHANGE_CORRECT_ANSWERS": {
        return {
          ...state,
          main_screens: state.main_screens.map((mainScreen, index) =>
            index === action.payload.index
            ? {
                ...mainScreen,
                data: {
                  ...mainScreen.data,
                  correct_answers: action.payload.value,
                },
              }
            : mainScreen
          ),
        };
      }      
      // case "CHANGE_CORRECT_ANSWERS": {
      //   const updatedMainScreens = [...state.main_screens];
      //   const updatedMainScreen = { ...updatedMainScreens[action.payload.index] };

      //   updatedMainScreen.data.correct_answers = action.payload.value;
      //   updatedMainScreens[action.payload.index] = updatedMainScreen;

      //   return {
      //     ...state,
      //     main_screens: updatedMainScreens,
      //   };
      // }
      case "REMOVE_MAIN_SCREEN":
        const updatedMainScreens = state.main_screens.filter((_, index) => index !== action.payload);
        return {
          ...state,
          main_screens: updatedMainScreens
        };
      case "REMOVE_FINAL_SCREEN":
        const updatedFinalScreens = state.final_screens.filter((_, index) => index !== action.payload);
        return {
          ...state,
          final_screens: updatedFinalScreens
        };
      case "REMOVE_ANSWER":
        return {
          ...state,
          main_screens: state.main_screens.map((mainScreen, screenIndex) =>
            screenIndex === action.payload.screenIndex
              ? {
                  ...mainScreen,
                  data: {
                    ...mainScreen.data,
                    answers: mainScreen.data.answers.filter(
                      (_, answerIndex) => answerIndex !== action.payload.answerIndex
                    ),
                  },
                }
              : mainScreen
          ),
        };
        // case "REMOVE_ANSWER": {
      //   const updatedMainScreens = [...state.main_screens];
      //   const updatedMainScreen = { ...updatedMainScreens[action.payload.screenIndex] };

      //   updatedMainScreen.data.answers.splice(action.payload.answerIndex, 1);
      //   updatedMainScreens[action.payload.screenIndex] = updatedMainScreen;

      //   return {
      //     ...state,
      //     main_screens: updatedMainScreens,
      //   };
      // }
      default:
        return state;
    }
  }


  const [state, dispatch] = useReducer(setupReducer, formData)


  const saveToDrafts = async () => {
    try {
      await fetch('/api/form/save-draft', {
        method: 'POST',
        body: JSON.stringify({
          object: state
        })
      })
      router.push("/forms")
    } catch(error){
      console.error(error) 
    }
  }

  const saveToForms = async () => {
    try {
      await fetch('/api/form/save-form', {
        method: 'POST',
        body: JSON.stringify({
          object: state
        })
      })
      router.push("/forms")
    } catch(error){
      console.error(error) 
    }
  }



  useEffect(() => {
    console.log(state.score_points, state.main_screens)
  }, [state])
  


  const togglePanel = (index: number) => {
    //! guard clause daca este la panel 1 si vrea sa treaca la panel 2, sa aiba neaparat form-ul completat
    if(panel === 1 && (index === 2 || index === 3)) {
      if(isEmptyString(state.title) || isEmptyString(state.type_id) || isEmptyString(state.collection_id)){
        console.log("panel 1 trebuie completat")
        toast.error("You must complete the form")
        return
      }
    }
    //! sau daca este la panel 2 si vrea sa treaca la panel 3, sa aiba macar 1 screen si 1 final ending completate
    if(index === 3){
      if(state.main_screens.length < 1){
        console.log("adauga macar 1 main screen")
        toast.error("At least 1 main screen is needed")
        return
      }

      if(state.final_screens.length < 1){
        console.log("adauga un final screen")
        toast.error("Add a final screen")
        return
      } else if(state.score_points) {
        let valid = true
        state.final_screens.forEach(screen => {
          if(isEmptyString(screen.score)){
            console.log("every final screen must have a score")
            toast.error("Every final screen must have a score")
            valid = false
          }
        })

        state.main_screens.forEach(screen => {
          if(screen?.data.correct_answers.length === 0){
            console.log("correct answers needed")
            toast.error("Correct answers needed")
            valid = false
          }
        })

        if(!valid){
          return
        }
      }
    }
    
    setPanel(index)
  }


  const confirmExit = async () => {
    if(isEmptyString(state.title) || isEmptyString(state.type_id) || isEmptyString(state.collection_id)){
      router.back()
    } else {
      const userResponse = window.confirm('Before leaving, save the form to drafts?');
      if (userResponse) {
        await saveToDrafts()
      } else {
        router.back();
      }
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => confirmExit();
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  

  const renderPanel = (): JSX.Element | null => {
    switch (panel) {
      case 1:
        return <TypePanel 
          togglePanel={togglePanel} 
          setup={state} 
          setSetup={dispatch} 
          properties={properties}
        />;
      case 2:
        return <CreatePanel setup={state} setSetup={dispatch} properties={properties} />;
      case 3:
        return <PreviewPanel 
          mainScreens={state.main_screens} 
          finalScreens={state.final_screens} 
          State_score={state.score_points} 
          State_color_palette={state.color_palette}
        />;
      default:
        return <TypePanel 
          togglePanel={togglePanel} 
          setup={state} 
          setSetup={dispatch} 
          properties={properties}
        />;
    }
  };

  return (
    <>

    <div id={css.screen_unsupported} className="container">
      <span>This page isn't supported for small screen devices. Please use a computer.</span>
    </div>

    <Header currentPanel={panel} togglePanel={togglePanel} setup={state} saveFormToForms={saveToForms} confirmExit={confirmExit} />

    {renderPanel()}

    <ToastContainer 
      position="bottom-right"
      autoClose={5000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />

    </>
  )
}

export default FormCreation