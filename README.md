
## !! Not ready for production, experimental

<p align="center">
<br>
<img src="https://avatars.githubusercontent.com/u/108695351?s=200&v=4" width="128" height="128">
</p>
<h3 align="center">@istanbul/rules</h3>
<p align="center">
  Rule package of <code>istanbul</code> framework. 
</p>

### What Is It?

This package is the rule package of the ``istanbul`` framework. It allows you to write and manage business rules in a cleaner way, not nested if conditions.

You don't have to use ```istanbul``` framework, ```@istanbul/rules``` is a nodejs package.

### Installation

```sh
npm install @istanbul/rules
```

> or with yarn
>
> ```sh
> yarn add @istanbul/rules
> ```

### Basic Usage

```typescript
import { createRule } from '@istanbul/rules';

const validateUserType = (user) => {
    return {success: user.type === 'admin', error: 'User type is not admin'};
}

const validateUser = createRule<string>(validateUserType);
```

### Advanced Usage

```typescript
import { createRule } from '@istanbul/rules';
import { ErrorDataResult } from "@istanbul/core"

type Product = {
    name: string;
    price: number;
    stock: number;
}

class ValidationError {
    constructor(public field: string, public message: string) {}
}

const nameValidator = (name: string) => {
    return name.length < 3 ? {success: false, error: new ValidationError('name', 'Name is too short')} : {success: true};
}

const priceNegativeValidator = (price: number) => {
    return price < 0 ? {success: false, error: new ValidationError('price', 'Price is negative')} : {success: true};
}

const priceLimitValidator = (price: number) => {
    return price > 100 ? {success: false, error: new ValidationError('price', 'Price is too high')} : {success: true};
}

const stockValidator = (stock: number) => {
    return stock < 10 ? {success: false, error: new ValidationError('stock', 'Stock is too short')} : {success: true};
}

const productValidatorMiddleware = (req, res, next) => {
    const { name, price, stock } = req.body;
    const result = createRule<ValidationError>()
        .start(nameValidator)
        .and(priceNegativeValidator)
        .or(priceLimitValidator)
        .and(stockValidator)
        .end(name, price, stock);
    next(result.success ? undefined : new ErrorDataResult("Validation Error", result.errors));
}
```

### Usage with waitAll option

It some cases we may wait for all the validations to perform, and sometimes we may want to finish if only one of the validation is false. Set waitAll to false if you want to terminate validation only when a false is returned.
 
```typescript
    const { name, price, stock } = req.body;
    const result = createRule<ValidationError>({waitAll: false}) 
        .start(nameValidator)
        .and(priceNegativeValidator)
        .or(priceLimitValidator)
        .and(stockValidator)
        .end(name, price, stock);
```

So if the first wrong transaction comes in ```priceNegativeValidator```, ```priceLimitValidator``` will not be executed.
