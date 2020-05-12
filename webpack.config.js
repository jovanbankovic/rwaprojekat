const path=require('path');
module.exports=
{
  mode:'development',
entry:['babel-polyfill','./src/index.ts'],

devtool:'inline-source-map',
resolve: {
  extensions: ['.ts', '.js', '.json']
},

output:{
path:path.resolve(__dirname,'dist'),
filename:'bundle.js',},
module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }}},
      {
        test: /\.ts$/, loader: "ts-loader"
      }
    ]},
devServer:{
    contentBase:'./' }
};