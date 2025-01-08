const path = require('path');

module.exports = {
  entry: './src/main.ts', // Fichier principal de votre application
  output: {
    filename: 'bundle.js', // Fichier de sortie
    path: path.resolve(__dirname, 'dist'), // Dossier de sortie
  },
  resolve: {
    extensions: ['.ts', '.js'], // Extensions reconnues
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Tous les fichiers .ts
        use: 'ts-loader', // Utilisation du ts-loader
        exclude: /node_modules/, // Exclure les fichiers de node_modules
      },
    ],
  },
  mode: 'production', // Utilisez "development" pour le développement
};
