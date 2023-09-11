## USAGE

### 数据处理

```ts
import { convertCurrency } from '@dumlj/currency'

const cent = 100e2
const resp = {
  name: 'product',
  price: cent,
  discount: {
    type: 'price',
    price: cent,
  },
  sku: [
    {
      name: 'product plus',
      price: cent,
    },
  ],
}

// 属性数组的转换方式
const yuanifedData = convertCurrency(resp).yuanify(['price', 'discount.price', 'sku.[].price'])
console.log(yuanifedData.price) // 100
console.log(yuanifedData.discount.price) // 100
console.log(yuanifedData.sku[0].price) // 100

// 属性数组的转换方式
const centifedData = convertCurrency(yuanifedData).centify(['price', 'discount.price', 'sku.[].price'])
console.log(centifedData.price) // 10000
console.log(centifedData.discount.price) // 10000
console.log(centifedData.sku[0].price) // 10000
```

## 其他用法

### 分转元

```ts
import { yuanify } from '@series-one/currency'

const cent = 100e2
const resp = {
  name: 'product',
  price: cent,
  discount: {
    type: 'price',
    price: cent,
  },
  sku: [
    {
      name: 'product plus',
      price: cent,
    },
  ],
}

// 属性数组的转换方式
const res = yuanify(resp, ['price', 'discount.price', 'sku.[].price'])
console.log(res.price) // 100
console.log(res.discount.price) // 100
console.log(res.sku[0].price) // 100
```

### 元转分

```ts
import { centify } from '@series-one/currency'

const yuan = 100
const body = {
  name: 'product',
  price: yuan,
  discount: {
    type: 'price',
    price: yuan,
  },
  sku: [
    {
      name: 'product plus',
      price: yuan,
    },
  ],
}

// 属性, 数组的转换方式
const res = centify(resp, ['price', 'discount.price', 'sku.[].price'])
console.log(res.price) // 10000
console.log(res.discount.price) // 10000
console.log(res.sku[0].price) // 10000
```
