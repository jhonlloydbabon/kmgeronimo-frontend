import React from 'react';

function HistoryTable({ tableHeaders, results, search, currentPage }) {
	return (
		<div className=' h-[550px] px-4 overflow-auto'>

			<table className='w-full tracking-wide table-fixed'>
				<thead className='bg-medium-gray'>
					<tr className="text-secondary">
						{
							tableHeaders.map((header, index) => (
								<th className='p-2 px-2 capitalize' key={index}>{header}</th>
							))
						}
					</tr>
				</thead>
				<tbody >
					{
						search.length > 0 ?
							results
								//       firstItem         LastItem
								.slice((currentPage * 8) - 8, currentPage * 8)
								.map((result, index) => (
									<tr className={`${index % 2 == 0 ? '' : 'bg-light-gray'} py-4`} key={result.historyId}>
										<td className='p-2 text-center '>
											{result.name}
										</td>
										<td className='p-2 text-center  '>
											{result.description}
										</td>
										<td className='p-2 text-center '>
											{result.appointmentDate}
										</td>
										<td className='p-2 text-center capitalize font-semibold'>
											<p className={`${result.status === "DONE" ? `bg-green` : `bg-red`} max-w-max m-auto p-2 rounded-md text-secondary`}>
												{result.status.toLowerCase()}
											</p>
										</td>
									</tr>
								))
							: results
								//       firstItem         LastItem
								.slice((currentPage * 8) - 8, currentPage * 8)
								.map((result, index) => (
									<tr className={`${index % 2 == 0 ? '' : 'bg-light-gray'} py-4`} key={result.historyId}>
										<td className='p-2 text-center '>
											{result.name}
										</td>
										<td className='p-2 text-center  '>
											{result.description}
										</td>
										<td className='p-2 text-center '>
											{result.appointmentDate}
										</td>
										<td className='p-2 text-center capitalize font-semibold'>
											<p className={`${result.status === "DONE" ? `bg-green` : `bg-red`} max-w-max m-auto p-2 rounded-md text-secondary`}>
												{result.status.toLowerCase()}
											</p>
										</td>
									</tr>
								))
					}
				</tbody>
			</table>
		</div>
	)
}

export default HistoryTable