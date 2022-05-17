import typescript from "@rollup/plugin-typescript";

const onProduction = process.env.NODE_ENV === 'production';

export default (async () => ({
    input: 'src/index.ts',
    output: {
        format: 'es',
        sourcemap: true,
        file: onProduction ? "dist/bundle.min.js" : "dist/index.js"
    },
    plugins: [
        typescript({ tsconfig: './tsconfig.json' }),
        onProduction && (await import('rollup-plugin-terser')).terser()
    ],
}))();