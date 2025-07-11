export default {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
        ['@babel/preset-react', { runtime: 'automatic' }]
    ],
    plugins: [
        ['@babel/plugin-transform-runtime', { regenerator: true }],
        'istanbul',
        '@babel/plugin-syntax-import-attributes',
        'babel-plugin-transform-typescript-metadata',
    ]
};
