import { BiLogOut } from "react-icons/bi";
import useLogout from '../../hooks/useLogout';
const LogoutButton = () => {
	const {loading, logout} = useLogout();

	return (
		<div className='mt-auto'>
			{!loading ? (
			<BiLogOut className='w-6 h-6 text-white cursor-pointer' onClick={logout}/>
			) : (
				<span className="loadinf loading-spinner"></span> // 데이지UI에서 제공하는 로딩 스피너
				)}
		</div>
	);
};
export default LogoutButton;