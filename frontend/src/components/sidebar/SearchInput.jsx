import toast from "react-hot-toast";
import { IoSearchSharp } from "react-icons/io5";
import { useState } from 'react';

import useGetConversations from "../../hooks/useGetConversations.js";
import useConversation from '../../zustand/useConversation';

const SearchInput = () => {
	const [search, setSearch] = useState('');
	const {setSelectedConversation} = useConversation();
	const {conversations} = useGetConversations();

	const handleSearch = (e) => {
		e.preventDefault();
		const conversation = conversations.find((c) => c.fullName.toLowerCase().includes(search.toLowerCase()));
		
		if(!search) return;
		if(search.length < 3){
			return toast.error('3글자 이상 입력해주세요.');
		}
		if (conversation) {
			setSelectedConversation(conversation);
			setSearch('');
		}else{
			toast.error('대화 상대를 찾을 수 없습니다.');
		}
	}
	return (
		<form className='flex items-center gap-2' onSubmit={handleSearch}>
			<input type='text' placeholder='Search…' className='input input-bordered rounded-full' value={search} onChange={(e) => setSearch(e.target.value)} />
			<button type='submit' className='btn btn-circle bg-sky-500 text-white'>
				<IoSearchSharp className='w-6 h-6 outline-none' />
			</button>
		</form>
	);
};
export default SearchInput;