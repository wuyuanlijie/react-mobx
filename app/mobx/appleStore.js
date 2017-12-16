import { observable, computed, action, autorun, useStrict, runInAction} from 'mobx';

// 启用严格模式 使得书写的更加的精确，不容易出错
useStrict(true);

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
  // 严格模式下只能在action中修改数据，但是action只能影响到函数当前状态下的情景，也就是说在await之后事情我们就修饰不到了， 必须使用runInAction
  @action pickApple = async () => {
    // 如果好着呢个在摘苹果， 结束这个
    if (this.isPicking) return;
    
    this.isPicking = true;
    this.buttonText = '正在采摘...';
    // fetch().then
    function getData () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let weight = Math.floor(200 + Math.random() * 50);
          resolve(weight)
        },1000)
      })
    };
    const data = await getData();
    runInAction("获取苹果的数据，修改state", () => {
      console.log(`新Apple的重量： ${data}`)
      this.isPicking = false;
      this.buttonText = '摘苹果';
      this.apples.push({
        id: this.newAppleId++,
        weight: data,
        isEaten: false,
      });
    })
    
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