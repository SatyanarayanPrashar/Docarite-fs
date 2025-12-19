import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabase-client';
import { User } from "@supabase/supabase-js";

export const useUserInfo = () => {
    const [userInfo, setUser] = useState<User | null>(null)
    const [userError, setUserError] = useState<Error | null>(null);

    async function fetchUser() {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
    }

    useEffect(() => {
        try {
            fetchUser();
        } catch (e) {
            setUserError(e as Error);
        }
    }, []);

    return { userInfo, userError };
};