import axios from "axios";

export const getUserDetail = async (userId: number) => {
    const res = await axios.get("/api/user/center?userId=" + userId);
    return res.data;
}