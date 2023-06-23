import React from 'react';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';

function Pagination({ setCurrentPage, pageNumber }) {
	return (
		<div className='py-2 mt-2 border-t-2 border-t-light-gray flex justify-center gap-2'>
			<button className='py-2 px-4 border border-light-gray cursor-pointer rounded flex items-center hover:bg-primary hover:text-secondary transition-all ease-linear duration-150' onClick={() => { setCurrentPage(prev => prev === 1 ? prev = 1 : prev -= 1) }} >
				<AiFillCaretLeft />
			</button>
			<div className='flex items-center gap-2'>
				{
					pageNumber.map((page, index) => (
						<button key={index} className='py-2 rounded px-4 border border-light-gray cursor-pointer flex items-center hover:bg-cyan-600 hover:text-secondary hover:bg-primary transition-all ease-linear duration-150' onClick={() => { setCurrentPage(page) }} >
							{page}
						</button>
					))
				}
			</div>

			<button className='py-2 px-4 border rounded border-light-gray cursor-pointer flex items-center hover:bg-primary hover:text-secondary transition-all ease-linear duration-150'>
				<AiFillCaretRight onClick={() => { setCurrentPage(prev => prev === pageNumber.length ? prev = pageNumber.length : prev += 1) }} />
			</button>
		</div>
	)
}

export default Pagination