import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';


// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
	envPrefix: 'CLIENT_',
	root: 'client',
	build: {
		cssMinify: 'esbuild',
		minify:    'terser',
		outDir:    '../static',
	},
	server: {
		host:       '0.0.0.0',
		port:       3000,
		strictPort: true,
		hmr:        {
			host:       '0.0.0.0',
			clientPort: 3000,
			port:       3000,
			path:       '/hmr',
		},
	},
	preview: {
		host:       '0.0.0.0',
		port:       3000,
		strictPort: true,
	},
	resolve: {
		alias: {
			'react':             'preact/compat',
			'react-dom':         'preact/compat',
			'react/jsx-runtime': 'preact/jsx-runtime',

			...(command === 'build' ? {} : {
				'fs':            '',
				'path':          '',
				'source-map-js': '',
				'url':           '',
			}),
		},
	},
	jsx: {
		factory: 'h',
		fragment: 'Fragment',
	},
	plugins: [preact()],
}));
