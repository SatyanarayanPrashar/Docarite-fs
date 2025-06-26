import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [userError, setUserError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Error fetching user info:", error);
                setUserError("Could not fetch user information.");
            } else {
                setUserInfo(data.user);
            }
        };
        fetchUser();
    }, []);

    return { userInfo, userError };
};
