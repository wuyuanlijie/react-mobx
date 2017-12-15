import { observable, computed, action, autorun } from 'mobx';

class appleStore {
  // 状态值 都放在observable
  @observable apples = [
    {
      id: 0,
      weight: 233,
      isEaten: false
    },
    {
      id: 1,
      weight: 235,
      isEaten: true,
    },
    {
      id: 2,
      weight: 256,
      isEaten: false,
    }
  ]; 
  @observable newAppleId = 3;
  @observable isPicking = false;
  @observable buttonText = '摘苹果！';

  // computed 计算属性 计算当前已吃和未吃的苹果的状态
  @computed get status () {
    let status = {
      appleNow: {
        quantity: 0,
        weight: 0
      },
      appleEaten: {
        quantity: 0,
        weight: 0,
      }
    };
    this.apples.forEach(apple => {
      let selector = apple.isEaten ? 'appleEaten' : 'appleNow';
      status[selector].quantity ++;
      status[selector].weight += apple.weight;
    });

    return status;
  }

  // 摘苹果的异步的操作 action
  @action pickApple = () => {
    // 如果好着呢个在摘苹果， 结束这个
    if (this.isPicking) return;
    
    this.isPicking = true;
    this.buttonText = '正在采摘...';
    // fetch().then
    setTimeout(() => {
      let weight = Math.floor(200 + Math.random() * 50);
      this.isPicking = false;
      this.buttonText = '摘苹果';
      this.apples.push({
        id: this.newAppleId++,
        weight: weight,
        isEaten: false,
      });
    },1000)
  }

  // 吃苹果的行为action 
  @action eatApple = appleId => {
    let targetIndex = '';
    this.apples.forEach((apple, index) => {
      apple.id === appleId ? targetIndex = index : '';
    });

    this.apples[targetIndex].isEaten = true;
  }


}

export default appleStore