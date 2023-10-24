import css from "@styles/creation.module.scss"
import TrashIcon from "@public/assets/icons/TrashIcon"
import OrderIcon from "@public/assets/icons/OrderIcon"
import { TruncateText } from "@utils/truncateText";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";


type Props = {
  id: number;
  title: string; 
  type: 'main_screen' | 'final_screen';
  onScreenDelete: (key: number) => void;
  setActiveScreen: React.Dispatch<React.SetStateAction<ActiveScreen | null>>
  isActiveScreen: boolean;
  provided?: DraggableProvided;
  snapshot?: DraggableStateSnapshot;
}

const ScreenBox = ({id, title, type, onScreenDelete, setActiveScreen, isActiveScreen, provided, snapshot}: Props) => {
  return (
    <div 
      ref={provided?.innerRef} {...provided?.draggableProps} 
      className={`${css.screen} ${isActiveScreen ? css.active : ''}`}
      style={{
        ...provided?.draggableProps.style,
        boxShadow: snapshot?.isDragging ? "0 0 .4rem #dedede": "none",
      }}
    >
      <div className={css.screen_icon} onClick={() => setActiveScreen({type: type, index: id})}></div>
      <p className={css.screen_title} onClick={() => setActiveScreen({type: type, index: id})}>
        {TruncateText(title, 60)}
      </p>
      <div className={css.screen_actions}>
        <div onClick={() => onScreenDelete(id)}>
          <TrashIcon />
        </div>
        <div {...provided?.dragHandleProps} className={css.order_icon}>
          <OrderIcon />
        </div>
      </div>
    </div>
  )
}

export default ScreenBox