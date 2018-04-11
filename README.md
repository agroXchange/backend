# AgroXchange API

### Admin routes

|**URI**|**VERB**|**ACTION**|
|-------------|-----------|-----------|
| /users      | GET       | all users |


### Public routes

|**URI**|**VERB**|**ACTION**|
|-------------|-----------|-----------|
| /users      | POST      | create    |
| /logins     | POST      | login     |

### User routes

|**URI**|**VERB**|**ACTION**|
|-------------|-----------|-----------|
| /users/:id  | GET       | 1 user *  |

### Order routes

|**URI**|**VERB**|**ACTION**|
|--------------------|-----------|--------------------|
| /orders            | GET       | All orders         |
| /orders/:id        | GET       | 1 order            |
|/products/:id/orders| POST      | create             |
|/orders/:id         | PATCH     | patch              |
|/orders/:id/users   | GET       | all orders by user |

_* If the logged in user is the same as the user you're getting it also gets the orders for that user_
