export const randStr = (n: number) => {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()_+';
	let result = '';

	for (let i = 0;i < n;++i) {
		result += alphabet[Math.floor(Math.random() * alphabet.length)];
	}

	return result;
};


