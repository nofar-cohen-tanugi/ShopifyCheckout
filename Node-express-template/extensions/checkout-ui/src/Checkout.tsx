import {
	Banner,
	useApi,
	useTranslate,
	reactExtension,
	useCartLines,
	Checkbox,
	Button,
	Form,
	BlockSpacer,
} from '@shopify/ui-extensions-react/checkout';
import { CartLine } from '@shopify/ui-extensions/checkout';
import { useState } from 'react';

export default reactExtension('purchase.checkout.block.render', () => <Extension />);

function Extension() {
	const [productsToSave, setProductsToSave] = useState<string[]>([]);

	const t = useTranslate();
	//const { extension } = useApi();
	const cart = useCartLines();

	const handleCheckProduct = (value: boolean, productId) => {
		if (value) {
			setProductsToSave((prev) => [...prev, productId]);
		}
		//uncheck
		else {
			setProductsToSave((prev) => prev.filter((id) => id !== productId));
		}
	};

	const handleSubmit = () => {
		console.log('submit');
		console.log(productsToSave);
	};

	return (
		<Banner title={t('saveYourCartTitle')}>
			<Form onSubmit={handleSubmit}>
				{cart?.map((item) => (
					<Checkbox
						key={item.merchandise.id}
						id={item.merchandise.id}
						name={item.merchandise.title}
						onChange={(e) => handleCheckProduct(e, item.merchandise.id)}
					>
						{item.merchandise.title}
					</Checkbox>
				))}
				<BlockSpacer spacing="base" />
				<Button accessibilityRole="submit">{t('form.save')}</Button>
			</Form>
		</Banner>
	);
}
