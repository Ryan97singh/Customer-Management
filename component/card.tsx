import { FC } from "react";

type ICard = {
	name: string;
	value: number | string;
};
const Card: FC<ICard> = ({ name, value }) => {
	return (
		<div className='max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow h-[100px] w-fit'>
			<a href='#'>
				<h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900'>
					{value}
				</h5>
			</a>
			<p className='mb-3 font-normal text-gray-700'>{name}</p>
		</div>
	);
};

export default Card;
