import { h } from "preact"; // eslint-disable-line
import { Button, Container, Heading, Image, Link } from "@chakra-ui/react";

export const NotFoundPage = () => {
	return (
		<section>
			<Container centerContent>
				<Image src="/assets/not-found.svg" alt="404" maxW="800px" />
				<Heading size="2xl">
					Oops! Страница, которую вы ищете, не найдена
				</Heading>
				<Link href="/" mt={4}>
					<Button type="button">На главную</Button>
				</Link>
			</Container>
		</section>
	);
};
