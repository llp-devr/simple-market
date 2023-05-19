# Simple-Market

Simple-Market is a web-based marketplace application. It's built with PHP and uses a Postgres database for data persistence.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- PHP
- PostgreSQL

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/llp-devr/simple-market.git
   ```

2. Navigate to the project directory

```
cd simple-market
```

3. Copy config.ini.example to config.ini and fill in your database credentials:

```
cp config.ini.example config.ini
```
4. Edit config.ini with your preferred text editor.

5. Set up the database structure. Run the SQL commands in db/schema.sql in your Postgres database.

6. Start the PHP server

``` 
php -S localhost:8000
```

7. Now, you should be able to visit http://localhost:8000 in your browser and see the application running.

License
This project is licensed under the MIT License.
