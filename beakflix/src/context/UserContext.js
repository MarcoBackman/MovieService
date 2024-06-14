import { createContext } from 'react';
const UserContext = createContext({
    name: "Guest",
    favorite_map: new Map()
});
export default UserContext;