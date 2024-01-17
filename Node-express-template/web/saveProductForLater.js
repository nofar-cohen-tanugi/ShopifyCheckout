import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CREATED_STATUS = 201;
const INTERNAL_SERVER_ERROR_STATUS = 500;

export const saveProductForLater = async (req, res) => {
	const { checkoutToken, productIds } = req.body;

	try {
		const savedProduct = await prisma.productSaveForLater.create({
			data: {
				checkoutToken,
				productIds,
			},
		});

		res.status(CREATED_STATUS).json(savedProduct);
	} catch (error) {
		console.error('Error saving product for later:', error);
		res.status(INTERNAL_SERVER_ERROR_STATUS).json({ error: 'Internal Server Error' });
	}
};
