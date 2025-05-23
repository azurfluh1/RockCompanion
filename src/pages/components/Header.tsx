import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth";

export default function Header() {
    let navigate = useNavigate();
    const {user} = useAuth()
    return (
        <div className='w-full h-[40px] py-12 px-5 lg:px-40 md:px-12 border-b border-gray-300 text-rose-800 font-mono text-2xl font-bolder flex justify-between items-center fixed h-[97px] top-0 bg-white z-[99]' style={{lineHeight: 1}}>
            <div className="flex-row cursor-pointer" onClick={()=>{navigate("/")}}>Rock Companion</div>
            {!user && <div className="flex-row text-lg text-[#745336] cursor-pointer" onClick={()=>{navigate("/login")}}>Login/Register</div>}
            {user && 
                <div className="flex-row text-lg text-[#745336] flex justify-between gap-[60px]">
                    <div className="flex-col text-lg text-[#745336] cursor-pointer"onClick={()=>{navigate("/tab-hero")}}>Play Tab Hero</div>
                    <div className="flex-col text-lg text-[#745336] cursor-pointer" onClick={()=>{navigate("/logout")}}>{user.username}</div>
                </div>
            }   
        </div>
    );
}
