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
import { useState } from 'react';
import { BannerProps } from '@shopify/ui-extensions/build/ts/surfaces/checkout/components/Banner/Banner';
import axios from 'axios';

const api = axios.create({
	baseURL: 'https://farm-du-promotes-mason.trycloudflare.com',
});

export default reactExtension('purchase.checkout.block.render', () => <Extension />);

function Extension() {
	const [productsToSave, setProductsToSave] = useState<string[]>([]);
	const [bannerOpts, setBannerOpts] = useState<BannerProps | null>(null);

	const t = useTranslate();
	const { checkoutToken } = useApi();
	const cart = useCartLines();

	const handleCheckProduct = (value: boolean, productIdPath) => {
		const path = productIdPath.split('/');
		const productId = path[path.length - 1];
		if (value) {
			setProductsToSave((prev) => [...prev, productId]);
		}
		//uncheck
		else {
			setProductsToSave((prev) => prev.filter((id) => id !== productId));
		}
	};
	const handleSubmit = async () => {
		setBannerOpts(null);
		const body = {
			checkoutToken: checkoutToken.current,
			productIds: JSON.stringify(productsToSave),
		};

		try {
			const response = await api.post('/api/save-product-for-later', body, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.data) {
				setBannerOpts({ status: 'critical', title: t('message.saveFailed') });
				console.error(`HTTP error! Status: ${response.status}`);
			} else {
				const responseData = await response.data.json();
				console.log(responseData);
				setBannerOpts({ status: 'success', title: t('message.savedSuccessfully') });
			}
		} catch (error) {
			setBannerOpts({ status: 'critical', title: t('message.saveFailed') });
			console.error(error);
		}
	};

	return (
		<Banner title={t('saveYourCartTitle')}>
			{bannerOpts && <Banner {...bannerOpts} />}
			<BlockSpacer spacing="base" />

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
