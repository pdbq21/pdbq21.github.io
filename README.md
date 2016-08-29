Using:
- webpack
- Express
- npm
- 


Fast start: (v1.0)
1. Создание package.json:
    1.1. npm init (and answer the questions)
    1.2. add ()
            "scripts": { 
              "start": "node server.js" 
            }
            
2. Для сборки нашего кода будем использовать Webpack:
    2.1. npm i webpack webpack-dev-middleware webpack-hot-middleware --save-dv
    2.2. create webpack.config.js
        var path = require('path')
        var webpack = require('webpack')
        
        module.exports = {
          devtool: 'cheap-module-eval-source-map',
          entry: [
            'webpack-hot-middleware/client',
            './src/index'
          ],
          output: {
            path: path.join(__dirname, 'dist'),
            filename: 'bundle.js',
            publicPath: '/static/'
          },
          plugins: [
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin()
          ]
        }
    2.3. install сервер для разработки Express
        npm i express --save-dev
    2.4 создадим наш web-сервер на Express основе
        create server.js
            var webpack = require('webpack')
            var webpackDevMiddleware = require('webpack-dev-middleware')
            var webpackHotMiddleware = require('webpack-hot-middleware')
            var config = require('./webpack.config')
            
            var app = new (require('express'))()
            var port = 3000
            
            var compiler = webpack(config)
            app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
            app.use(webpackHotMiddleware(compiler))
            
            app.get("/", function(req, res) {
              res.sendFile(__dirname + '/index.html')
            })
            
            app.listen(port, function(error) {
              if (error) {
                console.error(error)
              } else {
                console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
              }
            })
    2.5 create index.html
    2.6 create src/index.js (Добавим точку входа для webpack'а. Мы указали ее в нашем webpack.config.js в настройке entry - index.js)
        2.6.1 testing 
              npm start
              http://localhost:3000/
    2.7 Hot Reload:
        in src/index.js add module.hot.accept() bottom
3. Для использования возможностей ES6(2015) и ES7 будем использовать babel.
    3.1. npm install babel-core babel-loader --save-dev
    3.2. Далее нужно поставить пресеты (предустановки):
        # Для поддержки ES6/ES2015
        npm install babel-preset-es2015 --save-dev
        
        # Для поддержки JSX
        npm install babel-preset-react --save-dev
        
        # Для поддержки ES7
        npm install babel-preset-stage-0 --save-dev
    3.3. Нам однозначно нужен полифил, чтобы все фичи работали в браузере
        npm install babel-polyfill --save
    3.4. И немного улучшим время сборки, добавив следующие пакеты:
        npm install babel-runtime --save
        npm install babel-plugin-transform-runtime --save-dev
    3.5. in webpack.config.js add 
              ...
              new webpack.NoErrorsPlugin()
              ],
              module: { //Обновлено
                loaders: [ //добавили babel-loader
                  {
                    loaders: ['babel-loader'],
                    include: [
                      path.resolve(__dirname, "src"),
                    ],
                    test: /\.js$/,
                    plugins: ['transform-runtime'],
                  }
                ]
              }
            }
    3.6. create .babelrc (Добавилась запись в секции loaders. Теперь все js файлы в src директории будут обрабатываться babel-loader'ом, которому мы в свою очередь тоже должны указать настройки.)
            {
              "presets": ["es2015", "stage-0", "react"] //поддержка ES2015, ES7 и JSX
            }
4. создадим React компонент
    4.1. npm i react react-dom --save
    4.2. in src/index.js
            import 'babel-polyfill'
            import React from 'react'
            import { render } from 'react-dom'
            import App from './containers/App'
            
            
            render(
            <App />,
                document.getElementById('root')
            );
            module.hot.accept();
    4.3. create src/containers/App.js
            import React, { Component, PropTypes } from 'react'
            
            export default class App extends Component {
              render() {
                return <div>Привет из App</div>
              }
            }
    4.4. hot loader for react
        npm install react-hot-loader --save-dev            
    4.5. in webpack/config.js add  
            ...
        loaders: ['react-hot', 'babel-loader'], //добавили loader 'react-hot'
            ....
5. ESlint
    5.1. npm i babel-eslint eslint eslint-plugin-react --save-dev
    5.2. create .eslintrc
        0 - правило выключено
        1 - правило выдаст предупреждение
        2 - правило выдаст ошибку
    5.3. npm i eslint-loader --save-dev
    5.4. in webpack.config.js add 
            ...
            module: {
                    preLoaders: [ //добавили ESlint в preloaders
                        {
                            test: /\.js$/,
                            loaders: ['eslint'],
                            include: [
                                path.resolve(__dirname, "src"),
                            ],
                        }
                    ],
            ... 
    5.5. edit ../App.js 
           ... 
           import React, { Component } from 'react'
           ...
6. Redux
    6.1. Structure
        +-- src\n
        |   +-- actions
        |   +-- components
        |   +-- constants
        |   +-- containers
        |   +-- reducers
        |   |   +-- index.js
        |   +-- store
        |   |   +-- configureStore.js
        |   +-- index.js
        +-- index.html
        +-- package.json
        +-- server.js
        +-- webpack.config.js
    6.2. npm i redux react-redux --save
    6.3. edit src/index.js
            import React from 'react'
            import { render } from 'react-dom'
            import { Provider } from 'react-redux'
            import App from './containers/App'
            import configureStore from './store/configureStore'
            
            const store = configureStore()
            
            render(
              <Provider store={store}>
                <App />
              </Provider>,
              document.getElementById('root')
            )
    