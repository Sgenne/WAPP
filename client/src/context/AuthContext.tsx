import { createContext, useState } from "react";
import { User } from "../../../server/src/model/user.interface";

export interface AuthContextState {
  isSignedIn: boolean;
  signedInUser?: User;
  setSignedInUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  password?: string;
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setPassword: React.Dispatch<React.SetStateAction<string | undefined>>;
  showSignIn: boolean;
  setShowSignIn: React.Dispatch<React.SetStateAction<boolean>>;
  showRegister: boolean;
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
  setSignedInUser: () => {},
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
  const [password, setPassword] = useState<string>();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [signedInUser, setSignedInUser] = useState<User>();

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        setIsSignedIn,
        signedInUser,
        setSignedInUser,
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
