import { createContext } from 'react';
const SessionContext = createContext({
    login: false,
    status: "Sign In"
});
export default SessionContext;