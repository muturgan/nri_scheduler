import {
	Avatar,
	Box,
	Button,
	Container,
	Flex,
	HStack,
	Link,
	Stack,
	Text,
} from "@chakra-ui/react";
import { h } from "preact";
import { route as navigate } from "preact-router";

import { useState } from "preact/hooks";

import {
	PopoverArrow,
	PopoverBody,
	PopoverContent,
	PopoverRoot,
	PopoverTrigger,
} from "./ui/popover";
import { useStore } from "@nanostores/preact";
import { $signed } from "../store/profile";
import { logout } from "../api";

export const Header = () => {
	const user = {
		email: "example@mail.ru",
		name: "Username",
		avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04",
	};
	const [open, setOpen] = useState(false);

	const auth = useStore($signed);

	return (
		<header>
			<Box borderBottomWidth={1} mb={6}>
				<Container>
					<Flex gap={4} align="center" justify="space-between" py="6">
						<Link
							variant="plain"
							href="/calendar"
							fontWeight={600}
							fontSize={24}
						>
							НРИ Календарь
						</Link>
						{auth ? (
							<PopoverRoot
								open={open}
								onOpenChange={(e) => setOpen(e.open)}
								positioning={{ placement: "bottom-end" }}
							>
								<PopoverTrigger asChild>
									<Stack gap="8">
										<HStack key={user.email} gap="4">
											<Avatar.Root>
												<Avatar.Fallback name={user.name} />
												<Avatar.Image src={user.avatar} />
											</Avatar.Root>
											<Stack gap="0">
												<Text fontWeight="medium">{user.name}</Text>
												<Text color="fg.muted" textStyle="sm">
													{user.email}
												</Text>
											</Stack>
										</HStack>
									</Stack>
								</PopoverTrigger>
								<PopoverContent>
									<PopoverArrow />
									<PopoverBody>
										<Stack gapY={2}>
											<Link href="#">Профиль</Link>
											<Link
												href="#"
												colorPalette="red"
												onClick={() => {
													logout();
													navigate("/signin");
												}}
											>
												Выйти
											</Link>
										</Stack>
									</PopoverBody>
								</PopoverContent>
							</PopoverRoot>
						) : (
							<Link href="/signin" ml="auto">
								<Button type="button">Вход и регистрация</Button>
							</Link>
						)}
					</Flex>
				</Container>
			</Box>
		</header>
	);
};
