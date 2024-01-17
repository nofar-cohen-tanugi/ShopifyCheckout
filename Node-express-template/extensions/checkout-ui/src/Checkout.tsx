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
		try {
			const body = {
				checkoutToken: checkoutToken.current,
				productIds: JSON.stringify(productsToSave),
			};
			console.log(body);

			const response = await fetch(
				'https://whose-ringtones-tips-loaded.trycloudflare.com/api/save-product-for-later',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(body),
				}
			);

			if (!response.ok) {
				setBannerOpts({ status: 'critical', title: t('message.saveFailed') });
				console.error(`HTTP error! Status: ${response.status}`);
			}

			const responseData = await response.json();
			console.log(responseData);
			setBannerOpts({ status: 'success', title: t('message.savedSuccessfully') });
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
