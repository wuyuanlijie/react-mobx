import React, { Component } from 'react';
import { observer } from 'mobx-react';
import AppleItem from './AppleItem';
import '../styles/appleBasket.scss'

// 当数组的和mobx有数据的关联的时候 我们需要为其添加@observer  app.js中将store传递到这个组件中
@observer
class AppleBasket extends Component {
  // 获取未吃苹果的组件
  getAppleItem () {
    let data = [];
    this.props.store.apples.forEach(apple => {
      if (!apple.isEaten) {
        data.push(
          <AppleItem apple={apple} eatApple={this.props.store.eatApple} key={apple.id} />
        )
      }
    })
    if (!data.length)  return (<div className="empty-tip" key="empty">苹果篮子空空如也!</div>)
    return data;
  }

  render () {
    let { status, isPicking, buttonText, pickApple } = this.props.store;
    let { 
      appleNow: { quantity: notEatenQuantity, weight: notEatenWeight },
      appleEaten: { quantity: EatenQuantity, weight: EatenWeight }
    } = status;

    return (
      <div className="appleBasket">
        <div className="title">JerryLee苹果篮子</div>
        <div className="stats">
          <div className="section">
            <div className="head">当前</div>
            <div className="content">
              {notEatenQuantity}个苹果，{notEatenWeight}克
            </div>
          </div>
          <div className="section">
            <div className="head">已吃掉</div>
            <div className="content">
              {EatenQuantity}个苹果，{EatenWeight}克
            </div>
          </div>
        </div>
        <div className="appleList">
          {/* 这里不要bind()  bind只是在div的标签里面来绑定 */}
          { this.getAppleItem() }
        </div>

        <div className="btn-div">
          <button className={ isPicking ? 'disabled' : '' } onClick={ () => pickApple() }>
            { buttonText }
          </button>
        </div>
      </div>
    )
  }
}

export default AppleBasket;