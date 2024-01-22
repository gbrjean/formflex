

export const setupReducer = (state: State, action: Action): State => {
  switch(action.type){
    case "REVALIDATE_STATE":
      return action.data
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