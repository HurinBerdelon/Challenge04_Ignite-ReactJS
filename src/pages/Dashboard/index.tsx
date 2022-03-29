import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface IFoods {
	id: number,
	name: string,
	description: string,
	price: string,
	available: boolean,
	image: string
}

const Dashboard = (): JSX.Element => {

	const [foods, setFoods] = useState<IFoods[]>([])
	const [editingFood, setEditingFood] = useState<IFoods>({} as IFoods)
	const [modalOpen, setModalOpen] = useState(false)
	const [editModalOpen, setEditModalOpen] = useState(false)


	useEffect(() => {
		api.get('/foods')
			.then(response => setFoods(response.data))
	}, [])

	async function handleAddFood(food: Omit<IFoods, 'id' | 'available'>): Promise<void> {
		try {
			const response = await api.post('/foods', {
				...food,
				available: true
			})

			setFoods([
				...foods,
				response.data
			])

		} catch (err) {
			console.log(err)
		}
	}

	async function handleUpdateFood(food: Omit<IFoods, 'id' | 'available'>): Promise<void> {
		try {
			const foodUpdated = await api.put(
				`/foods/${editingFood.id}`,
				{
					...editingFood,
					...food
				}
			)

			const foodsUpdated = foods.map(food =>
				food.id !== foodUpdated.data.id ? food : foodUpdated.data
			)

			setFoods(foodsUpdated)

		} catch (err) {
			console.log(err)
		}
	}

	async function handleDeleteFood(id: number): Promise<void> {
		await api.delete(`/foods/${id}`);

		const foodsFiltered = foods.filter(food => food.id !== id);

		setFoods(foodsFiltered)
	}

	function toggleModal(): void {
		setModalOpen(!modalOpen)
	}

	function toggleEditModal(): void {
		setEditModalOpen(!editModalOpen)
	}

	function handleEditFood(food: IFoods): void {
		setEditModalOpen(true)
		setEditingFood(food)
	}

	return (
		<>
			<Header openModal={toggleModal} />
			<ModalAddFood
				isOpen={modalOpen}
				setIsOpen={toggleModal}
				handleAddFood={handleAddFood}
			/>
			<ModalEditFood
				isOpen={editModalOpen}
				setIsOpen={toggleEditModal}
				editingFood={editingFood}
				handleUpdateFood={handleUpdateFood}
			/>

			<FoodsContainer data-testid="foods-list">
				{foods &&
					foods.map(food => (
						<Food
							key={food.id}
							food={food}
							handleDelete={handleDeleteFood}
							handleEditFood={handleEditFood}
						/>
					))}
			</FoodsContainer>
		</>
	)
}

export default Dashboard;
