import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // Enrich with helper properties
            parsedUser.isAdmin = parsedUser.role === 'admin';
            parsedUser.isSales = parsedUser.role === 'sales' || parsedUser.role === 'admin';
            setUser(parsedUser);
        }
        setLoading(false);
    }, []);

    const login = async (name, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.post('/api/users/login', { name, password }, config);

            // Enrich with helper properties
            data.isAdmin = data.role === 'admin';
            data.isSales = data.role === 'sales' || data.role === 'admin';

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            throw error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            // Allow sending role for demo purposes. In production, this might be restricted.
            const { data } = await axios.post('/api/users', { name, email, password, role }, config);

            // Enrich with helper properties
            data.isAdmin = data.role === 'admin';
            data.isSales = data.role === 'sales' || data.role === 'admin';

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            throw error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
