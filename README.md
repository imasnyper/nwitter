# A Simple Twitter Clone
A simple Twitter clone made with Python/Django/Graphql(graphene-django) on the backend and ReactJS/Apollo on the frontend. Eventually plan on adding Graphql Subscriptions via Django Channels to implement subscription based data refetching. 

## Usage:

1. Press the following link to sign up: 

![Registration Direction](https://github.com/imasnyper/nwitter/blob/master/docs/installation%20images/login%20screen.png "Registration Direction")

2. Enter your information to register for the site:

![Empty Registration Page](https://github.com/imasnyper/nwitter/blob/master/docs/installation%20images/registration%20page.png)

![Registration Page Filled In](https://github.com/imasnyper/nwitter/blob/master/docs/installation%20images/registration%20filled%20in.png)

3. Enter your tweet and press Tweet! 🐦: 

![Empty Home Page](https://github.com/imasnyper/nwitter/blob/master/docs/installation%20images/empty%20home%20page.png)

![First Tweet](https://github.com/imasnyper/nwitter/blob/master/docs/installation%20images/First%20tweet.png)

4. Like/Retweet a tweet:

![Tweet on Homepage](https://github.com/imasnyper/nwitter/blob/master/docs/installation%20images/tweet%20on%20home%20page.png)

![Like/Retweet Tweet](https://github.com/imasnyper/nwitter/blob/master/docs/installation%20images/tweet%20on%20home%20page%20annotated.png)

## Running Local Prerequisites
___
1. Python 3.8
2. Pipenv
3. Node.js v12

## Installing Locally
___

### Backend Setup:
1. Clone repo into a local directory: 

```bash
git clone https://github.com/imasnyper/nwitter
```

2. Change into the backend directory of the cloned repository:

```bash
cd nwitter/backend
```

3. Install python environment requirements:

```bash
pipenv install
```

4. Activate environment shell: 

```bash
pipenv shell
```

5. Apply database migrations: 

```bash
python manage.py migrate
```

6. (Optional) Create a superuser: 

```bash
python manage.py createsuperuser
```

7. Start django server:

```bash
python manage.py runserver
```

### Frontend Setup

1. Change in to frontend directory:

```bash
cd ../frontend
```

2. Install frontend packages:

```bash
yarn
```

3. Start node.js server:

```bash
yarn start
```

