import css from "@styles/creation.module.scss"
import ScreenBox from "./ScreenBox"

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { toast } from "react-toastify";

interface LeftMenuProps {
  mainScreens: MainScreen[];
  finalScreens: FinalScreen[];
  triggerAddMainScreen: () => void;
  triggerAddFinalScreen: () => void;
  triggerDeleteMainScreen: (key: number) => void;
  triggerFinalDeleteScreen: (key: number) => void;
  setActiveScreen: React.Dispatch<React.SetStateAction<ActiveScreen | null>>;
  screenObjIndex: number;
  screenObjType: "main_screen" | "final_screen";
  formType: string;
}

const LeftMenu = ({
  mainScreens,
  finalScreens, 
  triggerAddMainScreen, 
  triggerAddFinalScreen,
  triggerDeleteMainScreen, 
  triggerFinalDeleteScreen,
  setActiveScreen,
  screenObjIndex,
  screenObjType,
  formType,
}: LeftMenuProps) => {

  return (
    <div className={css.left_menu}>
      <div className={css.main_screens}>

        <div className={css.heading}>
          <span>Main screens</span>
          <button className="btn btn-gray" onClick={() => triggerAddMainScreen()}>+</button>
        </div>
        
        <DragDropContext 
          onDragEnd={(params) => {
            const sourceIndex = params.source.index
            const destIndex = params.destination?.index
            
            if(formType == "Survey"){
              if(destIndex != undefined && 
                mainScreens[sourceIndex].question_type_name != "Text box" &&
                mainScreens[destIndex].question_type_name != "Text box"
              ) {
                const [movedEl] = mainScreens.splice(sourceIndex, 1);
                mainScreens.splice(destIndex, 0, movedEl);
  
                let newActiveIndex = screenObjIndex;
                if (sourceIndex === screenObjIndex) {
                  newActiveIndex = destIndex
                } else if (destIndex === screenObjIndex) {
                  newActiveIndex = sourceIndex < destIndex ? destIndex-1 : destIndex+1
                } else {
                  newActiveIndex = sourceIndex
                }

                if(screenObjType == "main_screen"){
                  setActiveScreen({ type: "main_screen", index: newActiveIndex >= 0 ? newActiveIndex : 0 });
                }
              } else if(
                  (destIndex != undefined && mainScreens[sourceIndex].question_type_name == "Text box") ||
                  (destIndex != undefined && mainScreens[destIndex].question_type_name == "Text box")
              ) {
                toast.error("Can't move the first main screen if it has the screen type of 'Text box'")
              } 
            } else {
                if(destIndex != undefined) {
                  const [movedEl] = mainScreens.splice(sourceIndex, 1);
                  mainScreens.splice(destIndex, 0, movedEl);
    
                  let newActiveIndex = screenObjIndex;
                  if (sourceIndex === screenObjIndex) {
                    newActiveIndex = destIndex
                  } else if (destIndex === screenObjIndex) {
                    newActiveIndex = sourceIndex < destIndex ? destIndex-1 : destIndex+1
                  } else {
                    newActiveIndex = sourceIndex
                  }

                  if(screenObjType == "main_screen"){
                    setActiveScreen({ type: "main_screen", index: newActiveIndex >= 0 ? newActiveIndex : 0 });
                  }
                }
            }
          }}
        >
          <div className={css.screen_wrapper}>

            { mainScreens.length === 0 ? (
              <p>Please add screens</p>
            ) : (
              <Droppable droppableId="droppable-1">
                {(provided, _) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className={css.screen_wrapper}>
                    { mainScreens.map((screen, key) => (
                      <Draggable key={key} draggableId={`draggable-${key}`} index={key}>
                        {(provided, snapshot) => (
                          <ScreenBox 
                            provided={provided} 
                            snapshot={snapshot}
                            isActiveScreen={screenObjType == "main_screen" ? (screenObjIndex === key ? true : false) : false} 
                            key={key} id={key} 
                            title={screen.title} 
                            type="main_screen" 
                            setActiveScreen={setActiveScreen} 
                            onScreenDelete={triggerDeleteMainScreen}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}

          </div>
        </DragDropContext>

      </div>

      <div className={css.final_screens}>

        <div className={css.heading}>
          <span>Final screens</span>
          <button className="btn btn-gray" onClick={triggerAddFinalScreen}>+</button>
        </div>
        
        <div className={css.screen_wrapper}>

          { finalScreens.length === 0 ? (
              <p>Please add screens</p>
            ) : 
            finalScreens.map((screen, key) => (
              <ScreenBox 
                isActiveScreen={screenObjType == "final_screen" ? (screenObjIndex === key ? true : false) : false} 
                key={key} id={key} 
                title={screen.title} 
                type="final_screen" 
                setActiveScreen={setActiveScreen} 
                onScreenDelete={triggerFinalDeleteScreen} 
              />
            ))
          }

        </div>
        
      </div>
    </div>
  )
}

export default LeftMenu