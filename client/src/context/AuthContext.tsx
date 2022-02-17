import { createContext, useState } from "react";

export interface AuthContextState {
  /**
   * Indicates if the user is signed in.
   */
  isSignedIn: boolean;

  /**
   * The id of the user if they are signed in.
   */
  userId?: string;

  /**
   * The password of the user if they are signed in.
   */
  password?: string;

  /**
   * Updates the stored isSignedIn value.
   */
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;

  /**
   * Updates the stored id.
   */
  setUserId: React.Dispatch<React.SetStateAction<string | undefined>>;

  /**
   * Updates the stored password.
   */
  setPassword: React.Dispatch<React.SetStateAction<string | undefined>>;

  /**
   * Indicates if the sign-in lightbox should be displayed.
   */
  showSignIn: boolean;

  /**
   * Updates the value of showSignIn.
   */
  setShowSignIn: React.Dispatch<React.SetStateAction<boolean>>;

  /**
   * Indicates if the register lightbox should be displayed.
   */
  showRegister: boolean;

  /**
   * Updates the value of showRegister.
   */
  setShowRegister: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * The default state of AuthContext. Holds dummy values
 * that won't be used anywhere. Alternatively, we could
 * set createContext's argument to null.
 */
const defaultState: AuthContextState = {
  isSignedIn: false,
  setIsSignedIn: () => {},
  setUserId: () => {},
  setPassword: () => {},
  showSignIn: false,
  setShowSignIn: () => {},
  showRegister: false,
  setShowRegister: () => {},
};

/**
 * createContext allows us to reach AuthContext with the function
 * "useContext" from React.
 */
export const AuthContext = createContext<AuthContextState>(defaultState);

/**
 * All children of this component will be able to access the AuthContext
 * state. Since it wrapps the entire application (in index.tsx), the
 * AuthContext state becomes available to all components in the application.
 */
export const AuthContextProvider = (props: { children: JSX.Element }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userId, setUserId] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        setIsSignedIn,
        userId,
        setUserId,
        password,
        setPassword,
        showSignIn,
        setShowSignIn,
        showRegister,
        setShowRegister,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
