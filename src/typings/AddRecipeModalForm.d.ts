// { show, setShow , getAllRecipes}

interface AddRecipeModalFormProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  getAllRecipes: () => Promise<void>;
}

interface AddRecipeFormDataState {
  name: string;
  overView: string;
  image: string | undefined;
}
