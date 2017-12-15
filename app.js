import React from 'react';
import ReactDOM from 'react-dom';
import { autorun } from 'mobx';
import appleStore from './app/mobx/appleStore'
import AppleBasket from './app/mobx/AppleBasket'

const store = new appleStore();

// acturun 测试
autorun(() => {
  store.isPicking ? console.log('又在摘新苹果了！') : "";
})


ReactDOM.render(
  <AppleBasket store={store} />,
   document.getElementById('root')
);

// react-hot-loader 设置
if (module.hot) {
  module.hot.accept();
}
