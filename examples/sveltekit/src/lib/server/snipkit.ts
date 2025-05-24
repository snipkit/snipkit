import snipkit, { shield } from '@snipkit/sveltekit';
import { env } from '$env/dynamic/private';

export const aj = snipkit({
	key: env.SNIPKIT_KEY!,
	rules: [shield({ mode: 'LIVE' })]
});
