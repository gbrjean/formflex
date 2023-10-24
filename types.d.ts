

declare type FinalScreen = {
  description: string;
  title: string;
  score: string;
  image?: string;
  allowed_image: boolean;
  [key: string]: any;
};


declare type Answer = {
  content: string;
  points?: string;
};

declare type MainScreenData = {
  answers: Answer[];
  correct_answers: string[];
};


declare type MainScreen = {
  description: string;
  image?: string;
  questions_type: string;
  question_type_name: string;
  data: MainScreenData;
  title: string;
  allowed_image: boolean;
  [key: string]: any;
};

declare type State = {
  completions: number;
  exits: number;
  final_screens: FinalScreen[];
  main_screens: MainScreen[];
  mid_completion_exits: number;
  questions_no: number;
  title: string;
  type_id: string;
  type_name: string;
  collection_id: string;
  user_id?: string;
  views: number;
  color_palette: string;
  score_points: boolean;
  [key: string]: any;
};


declare type Action =
  | { type: "CHANGE_INPUT"; payload: { name: string; value: any } }
  | { type: "ADD_SCREEN"; payload: { name: string; value: {} } }
  | { type: "CHANGE_MAIN_SCREEN_INPUT"; payload: { index: number; field: string; value: any } }
  | { type: "CHANGE_FINAL_SCREEN_INPUT"; payload: { index: number; field: string; value: any } }
  | { type: "ADD_ANSWER"; payload: { index: number; value: Answer } }
  | { type: "CHANGE_ANSWERS"; payload: { index: number; value: any[] } }
  | { type: "CHANGE_CORRECT_ANSWERS"; payload: { index: number; value: any[] } }
  | { type: "REMOVE_MAIN_SCREEN"; payload: number }
  | { type: "REMOVE_FINAL_SCREEN"; payload: number }
  | { type: "REMOVE_ANSWER"; payload: { screenIndex: number; answerIndex: number } }


type ActiveScreen = {
  type: "main_screen" | "final_screen";
  index: number;
}

  